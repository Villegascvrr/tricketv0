import { cn } from "@/lib/utils";

interface ChatMessageRendererProps {
  content: string;
  className?: string;
}

const ChatMessageRenderer = ({ content, className }: ChatMessageRendererProps) => {
  // Parse markdown-like syntax for better formatting
  const parseContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentList: string[] = [];
    let listType: 'bullet' | 'numbered' | null = null;
    let keyCounter = 0;

    const flushList = () => {
      if (currentList.length > 0) {
        if (listType === 'numbered') {
          elements.push(
            <ol key={keyCounter++} className="list-decimal list-inside space-y-1 my-2 ml-1">
              {currentList.map((item, i) => (
                <li key={i} className="text-sm leading-relaxed">
                  {parseInline(item)}
                </li>
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={keyCounter++} className="space-y-1.5 my-2">
              {currentList.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{parseInline(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        currentList = [];
        listType = null;
      }
    };

    const parseInline = (text: string): React.ReactNode => {
      // Process inline formatting
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let partKey = 0;

      while (remaining.length > 0) {
        // Bold: **text**
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Code: `text`
        const codeMatch = remaining.match(/`([^`]+)`/);
        // Emoji numbers like 1️⃣ 2️⃣ 3️⃣
        
        if (boldMatch && (!codeMatch || boldMatch.index! < codeMatch.index!)) {
          if (boldMatch.index! > 0) {
            parts.push(<span key={partKey++}>{remaining.slice(0, boldMatch.index)}</span>);
          }
          parts.push(
            <strong key={partKey++} className="font-semibold text-foreground">
              {boldMatch[1]}
            </strong>
          );
          remaining = remaining.slice(boldMatch.index! + boldMatch[0].length);
        } else if (codeMatch) {
          if (codeMatch.index! > 0) {
            parts.push(<span key={partKey++}>{remaining.slice(0, codeMatch.index)}</span>);
          }
          parts.push(
            <code key={partKey++} className="px-1.5 py-0.5 bg-primary/10 text-primary rounded text-xs font-mono">
              {codeMatch[1]}
            </code>
          );
          remaining = remaining.slice(codeMatch.index! + codeMatch[0].length);
        } else {
          parts.push(<span key={partKey++}>{remaining}</span>);
          break;
        }
      }

      return parts.length === 1 ? parts[0] : <>{parts}</>;
    };

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Empty line
      if (!trimmedLine) {
        flushList();
        elements.push(<div key={keyCounter++} className="h-2" />);
        continue;
      }

      // Headers with ** at start
      if (trimmedLine.match(/^\*\*[^*]+\*\*$/)) {
        flushList();
        const headerText = trimmedLine.replace(/\*\*/g, '');
        elements.push(
          <h4 key={keyCounter++} className="font-semibold text-sm text-foreground mt-3 mb-1.5 flex items-center gap-2">
            {headerText.includes('📊') || headerText.includes('💰') || headerText.includes('🎯') || headerText.includes('📈') || headerText.includes('⚠️') || headerText.includes('✅') || headerText.includes('💡') ? (
              headerText
            ) : (
              <>
                <span className="w-1 h-4 bg-primary rounded-full" />
                {headerText}
              </>
            )}
          </h4>
        );
        continue;
      }

      // Section headers (text ending with :)
      if (trimmedLine.match(/^[A-ZÁÉÍÓÚÑ].+:$/) && !trimmedLine.includes('•')) {
        flushList();
        elements.push(
          <h4 key={keyCounter++} className="font-semibold text-sm text-foreground mt-3 mb-1.5 flex items-center gap-2">
            <span className="w-1 h-4 bg-primary rounded-full" />
            {trimmedLine}
          </h4>
        );
        continue;
      }

      // Bullet points
      if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
        if (listType !== 'bullet') {
          flushList();
          listType = 'bullet';
        }
        currentList.push(trimmedLine.replace(/^[•\-*]\s*/, ''));
        continue;
      }

      // Numbered lists
      const numberedMatch = trimmedLine.match(/^(\d+)[.)\-]\s*(.+)/);
      if (numberedMatch) {
        if (listType !== 'numbered') {
          flushList();
          listType = 'numbered';
        }
        currentList.push(numberedMatch[2]);
        continue;
      }

      // Regular paragraph
      flushList();
      
      // Check if it's an emoji-prefixed line (like 📊 or 💡)
      const emojiPrefix = trimmedLine.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}])/u);
      if (emojiPrefix) {
        elements.push(
          <p key={keyCounter++} className="text-sm leading-relaxed my-1.5 flex items-start gap-2">
            <span className="flex-shrink-0">{emojiPrefix[0]}</span>
            <span>{parseInline(trimmedLine.slice(emojiPrefix[0].length).trim())}</span>
          </p>
        );
      } else {
        elements.push(
          <p key={keyCounter++} className="text-sm leading-relaxed my-1">
            {parseInline(trimmedLine)}
          </p>
        );
      }
    }

    flushList();
    return elements;
  };

  return (
    <div className={cn("space-y-0", className)}>
      {parseContent(content)}
    </div>
  );
};

export default ChatMessageRenderer;
