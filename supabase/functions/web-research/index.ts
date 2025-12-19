import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WebResearchRequest {
  type: 'search' | 'scrape';
  query?: string;
  url?: string;
  options?: {
    recencyFilter?: 'day' | 'week' | 'month' | 'year';
    scrapeFormats?: ('markdown' | 'links')[];
    limit?: number;
  };
}

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  citations?: string[];
}

interface FirecrawlResponse {
  success: boolean;
  data?: {
    markdown?: string;
    links?: string[];
    metadata?: {
      title?: string;
      description?: string;
      sourceURL?: string;
    };
  };
  error?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, query, url, options }: WebResearchRequest = await req.json();

    console.log(`Web research request: type=${type}, query=${query}, url=${url}`);

    if (type === 'search') {
      // Use Perplexity for web search
      const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
      if (!perplexityApiKey) {
        console.error('PERPLEXITY_API_KEY not configured');
        return new Response(
          JSON.stringify({ success: false, error: 'Perplexity API not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!query) {
        return new Response(
          JSON.stringify({ success: false, error: 'Query is required for search' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Calling Perplexity API with query:', query);

      const perplexityBody: any = {
        model: 'sonar',
        messages: [
          { 
            role: 'system', 
            content: 'Eres un asistente de investigación experto en festivales de música, eventos y entretenimiento en España. Responde en español con información precisa y cita las fuentes.' 
          },
          { role: 'user', content: query }
        ],
      };

      // Add recency filter if specified
      if (options?.recencyFilter) {
        perplexityBody.search_recency_filter = options.recencyFilter;
      }

      const perplexityResponse = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${perplexityApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(perplexityBody),
      });

      if (!perplexityResponse.ok) {
        const errorText = await perplexityResponse.text();
        console.error('Perplexity API error:', perplexityResponse.status, errorText);
        return new Response(
          JSON.stringify({ success: false, error: `Perplexity API error: ${perplexityResponse.status}` }),
          { status: perplexityResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data: PerplexityResponse = await perplexityResponse.json();
      console.log('Perplexity response received with citations:', data.citations?.length || 0);

      return new Response(
        JSON.stringify({
          success: true,
          type: 'search',
          content: data.choices[0]?.message?.content || '',
          citations: data.citations || [],
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (type === 'scrape') {
      // Use Firecrawl for URL scraping
      const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
      if (!firecrawlApiKey) {
        console.error('FIRECRAWL_API_KEY not configured');
        return new Response(
          JSON.stringify({ success: false, error: 'Firecrawl API not configured' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      if (!url) {
        return new Response(
          JSON.stringify({ success: false, error: 'URL is required for scraping' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Format URL
      let formattedUrl = url.trim();
      if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
        formattedUrl = `https://${formattedUrl}`;
      }

      console.log('Calling Firecrawl API for URL:', formattedUrl);

      const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${firecrawlApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: formattedUrl,
          formats: options?.scrapeFormats || ['markdown'],
          onlyMainContent: true,
        }),
      });

      if (!firecrawlResponse.ok) {
        const errorText = await firecrawlResponse.text();
        console.error('Firecrawl API error:', firecrawlResponse.status, errorText);
        return new Response(
          JSON.stringify({ success: false, error: `Firecrawl API error: ${firecrawlResponse.status}` }),
          { status: firecrawlResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await firecrawlResponse.json();
      console.log('Firecrawl response received');

      // Handle nested data structure - Firecrawl v1 nests content inside data
      const responseData = data.data || data;

      return new Response(
        JSON.stringify({
          success: true,
          type: 'scrape',
          content: responseData.markdown || '',
          links: responseData.links || [],
          metadata: responseData.metadata || { sourceURL: formattedUrl },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid type. Use "search" or "scrape"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in web-research function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
