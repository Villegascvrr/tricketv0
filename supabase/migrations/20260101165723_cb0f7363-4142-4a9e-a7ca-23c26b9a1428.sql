
-- Seed Demo Data for Primaverando Festival 2025

-- 1. Insert the demo event
INSERT INTO public.events (id, name, type, venue, start_date, end_date, total_capacity, owner_id)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Primaverando Festival 2025',
  'festival',
  'Recinto Ferial de Madrid',
  '2025-06-15',
  '2025-06-17',
  20000,
  NULL
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert zones for the event
INSERT INTO public.zones (event_id, name, capacity) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'General', 12000),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'VIP', 3000),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Backstage', 500),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Camping', 4500);

-- 3. Insert ticket provider allocations
INSERT INTO public.ticket_provider_allocations (event_id, provider_name, allocated_capacity, notes) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ticketmaster', 8000, 'Main ticketing partner'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Eventbrite', 5000, 'Secondary partner'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Dice', 4000, 'International sales'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Taquilla', 3000, 'Box office sales');

-- 4. Insert sample tickets (14,850 tickets with realistic distribution)
DO $$
DECLARE
  event_uuid UUID := 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';
  cities_madrid TEXT[] := ARRAY['Madrid', 'Alcalá de Henares', 'Móstoles', 'Getafe', 'Leganés'];
  cities_barcelona TEXT[] := ARRAY['Barcelona', 'Hospitalet', 'Badalona', 'Terrassa', 'Sabadell'];
  cities_valencia TEXT[] := ARRAY['Valencia', 'Alicante', 'Elche', 'Castellón'];
  
  i INT;
  rand_val FLOAT;
  selected_province TEXT;
  selected_city TEXT;
  selected_provider TEXT;
  selected_zone TEXT;
  selected_type TEXT;
  selected_channel TEXT;
  ticket_price NUMERIC;
  sale_timestamp TIMESTAMP WITH TIME ZONE;
  birth_year INT;
  age INT;
  has_email_val BOOLEAN;
  has_phone_val BOOLEAN;
  marketing_val BOOLEAN;
BEGIN
  IF EXISTS (SELECT 1 FROM public.tickets WHERE event_id = event_uuid LIMIT 1) THEN
    RETURN;
  END IF;

  FOR i IN 1..14850 LOOP
    rand_val := random() * 100;
    IF rand_val < 35 THEN selected_province := 'Madrid';
    ELSIF rand_val < 55 THEN selected_province := 'Barcelona';
    ELSIF rand_val < 67 THEN selected_province := 'Valencia';
    ELSIF rand_val < 75 THEN selected_province := 'Sevilla';
    ELSIF rand_val < 81 THEN selected_province := 'Málaga';
    ELSIF rand_val < 86 THEN selected_province := 'Bilbao';
    ELSIF rand_val < 90 THEN selected_province := 'Zaragoza';
    ELSIF rand_val < 94 THEN selected_province := 'Murcia';
    ELSIF rand_val < 97 THEN selected_province := 'Palma de Mallorca';
    ELSE selected_province := 'Las Palmas';
    END IF;
    
    CASE selected_province
      WHEN 'Madrid' THEN selected_city := cities_madrid[1 + floor(random() * 5)::int];
      WHEN 'Barcelona' THEN selected_city := cities_barcelona[1 + floor(random() * 5)::int];
      WHEN 'Valencia' THEN selected_city := cities_valencia[1 + floor(random() * 4)::int];
      ELSE selected_city := selected_province;
    END CASE;
    
    rand_val := random() * 100;
    IF rand_val < 40 THEN selected_provider := 'Ticketmaster';
    ELSIF rand_val < 65 THEN selected_provider := 'Eventbrite';
    ELSIF rand_val < 85 THEN selected_provider := 'Dice';
    ELSE selected_provider := 'Taquilla';
    END IF;
    
    rand_val := random() * 100;
    IF rand_val < 60 THEN 
      selected_zone := 'General';
      selected_type := CASE WHEN random() < 0.7 THEN 'Abono 3 días' ELSE 'Entrada día' END;
      ticket_price := CASE WHEN selected_type = 'Abono 3 días' THEN 120 + random() * 30 ELSE 55 + random() * 15 END;
    ELSIF rand_val < 75 THEN 
      selected_zone := 'VIP';
      selected_type := 'VIP Experience';
      ticket_price := 250 + random() * 100;
    ELSIF rand_val < 77 THEN 
      selected_zone := 'Backstage';
      selected_type := 'VIP Experience';
      ticket_price := 450 + random() * 150;
    ELSE 
      selected_zone := 'Camping';
      selected_type := 'Camping Pack';
      ticket_price := 180 + random() * 40;
    END IF;
    
    rand_val := random() * 100;
    IF rand_val < 55 THEN selected_channel := 'Web';
    ELSIF rand_val < 80 THEN selected_channel := 'App';
    ELSIF rand_val < 92 THEN selected_channel := 'Punto de venta';
    ELSE selected_channel := 'Promoción';
    END IF;
    
    sale_timestamp := NOW() - (random() * 180 || ' days')::interval - (random() * 12 || ' hours')::interval;
    
    rand_val := random();
    IF rand_val < 0.15 THEN birth_year := 2006 - floor(random() * 6)::int;
    ELSIF rand_val < 0.55 THEN birth_year := 2000 - floor(random() * 10)::int;
    ELSIF rand_val < 0.80 THEN birth_year := 1990 - floor(random() * 10)::int;
    ELSIF rand_val < 0.93 THEN birth_year := 1980 - floor(random() * 10)::int;
    ELSE birth_year := 1970 - floor(random() * 10)::int;
    END IF;
    age := EXTRACT(YEAR FROM NOW())::int - birth_year;
    
    has_email_val := random() < 0.92;
    has_phone_val := random() < 0.68;
    marketing_val := random() < 0.45;
    
    INSERT INTO public.tickets (
      event_id, provider_name, zone_name, ticket_type, price, 
      sale_date, channel, buyer_province, buyer_city, buyer_country,
      buyer_birth_year, buyer_age, has_email, has_phone, marketing_consent,
      status, external_ticket_id
    ) VALUES (
      event_uuid, selected_provider, selected_zone, selected_type, round(ticket_price::numeric, 2),
      sale_timestamp, selected_channel, selected_province, selected_city, 'España',
      birth_year, age, has_email_val, has_phone_val, marketing_val,
      'confirmed', 'TKT-' || lpad(i::text, 6, '0')
    );
  END LOOP;
END $$;

-- 5. Insert pre-festival tasks (using valid constraint values)
-- area: produccion, logistica, proveedores, rrhh, seguridad, licencias, ticketing, comunicacion
-- status: pendiente, en_curso, bloqueada, hecha
-- priority: baja, media, alta
INSERT INTO public.pre_festival_tasks (event_id, title, description, area, status, priority, due_date, assignee_name) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Confirmar lineup final', 'Cerrar contratos con todos los artistas del cartel', 'produccion', 'hecha', 'alta', '2025-04-01', 'María García'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Coordinar seguridad', 'Contratar y coordinar equipo de seguridad', 'seguridad', 'en_curso', 'alta', '2025-05-15', 'Carlos López'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Diseñar zona VIP', 'Planificar experiencia exclusiva VIP', 'produccion', 'pendiente', 'media', '2025-05-01', 'Ana Martínez'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Campaña email marketing', 'Lanzar campaña de recordatorio', 'comunicacion', 'pendiente', 'media', '2025-06-01', 'Pedro Sánchez'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Instalar escenarios', 'Montaje de escenarios principales', 'logistica', 'pendiente', 'alta', '2025-06-10', 'Luis Fernández'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Gestionar proveedores catering', 'Confirmar contratos con catering y food trucks', 'proveedores', 'en_curso', 'media', '2025-05-20', 'Laura Ruiz'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Tramitar licencias municipales', 'Obtener permisos del ayuntamiento', 'licencias', 'hecha', 'alta', '2025-03-15', 'Javier Torres'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Configurar sistema ticketing', 'Integrar APIs de ticketeras', 'ticketing', 'hecha', 'alta', '2025-02-28', 'Marta Gómez');

-- 6. Insert demo marketing campaigns
INSERT INTO public.marketing_campaigns (name, platform, type, status, start_date, end_date, budget, spent, reach, clicks, tickets_sold, estimated_revenue, ctr) VALUES
  ('Early Bird Launch', 'instagram', 'paid', 'completed', '2025-01-15', '2025-02-15', 5000, 4850, 125000, 3750, 890, 106800, 3.0),
  ('Spring Promo', 'facebook', 'paid', 'active', '2025-03-01', '2025-04-30', 8000, 4200, 180000, 4500, 650, 78000, 2.5),
  ('Influencer Collab', 'tiktok', 'organic', 'active', '2025-04-01', '2025-06-01', 3000, 1500, 450000, 12000, 420, 50400, 2.67),
  ('Last Call Campaign', 'google', 'paid', 'scheduled', '2025-06-01', '2025-06-14', 10000, 0, 0, 0, 0, 0, 0);
