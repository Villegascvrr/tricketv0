import { cn } from "@/lib/utils";
import { ExternalLink, Globe } from "lucide-react";

interface ChatMessageRendererProps {
  content: string;
  className?: string;
}

interface ParsedContent {
  mainContent: string;
  sources: { index: number; url: string }[];
}

// Extract sources from ---SOURCES--- block
const extractSources = (text: string): ParsedContent => {
  const sourcesMatch = text.match(/---SOURCES---\n([\s\S]*?)$/);
  
  if (!sourcesMatch) {
    return { mainContent: text, sources: [] };
  }
  
  const mainContent = text.replace(/---SOURCES---[\s\S]*$/, '').trim();
  const sourcesBlock = sourcesMatch[1];
  const sources: { index: number; url: string }[] = [];
  
  const sourceLines = sourcesBlock.split('\n').filter(l => l.trim());
  for (const line of sourceLines) {
    const match = line.match(/\[(\d+)\]\s*(\S+)/);
    if (match) {
      sources.push({ index: parseInt(match[1]), url: match[2] });
    }
  }
  
  return { mainContent, sources };
};

const ChatMessageRenderer = ({ content, className }: ChatMessageRendererProps) => {
  const { mainContent, sources } = extractSources(content);
  
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
            <ol key={keyCounter++} className="space-y-2 my-3">
              {currentList.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{parseInline(item)}</span>
                </li>
              ))}
            </ol>
          );
        } else {
          elements.push(
            <ul key={keyCounter++} className="space-y-2 my-3 ml-1">
              {currentList.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
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
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let partKey = 0;

      while (remaining.length > 0) {
        // Bold: **text**
        const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
        // Code: `text`
        const codeMatch = remaining.match(/`([^`]+)`/);
        
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
        elements.push(<div key={keyCounter++} className="h-3" />);
        continue;
      }

      // Section headers with emoji (📊 Análisis, 📈 Métricas, etc.)
      const emojiHeaderMatch = trimmedLine.match(/^(\*\*)?([📊📈🎯💡⚠️✅💰🔍📰🌐])\s*(.+?)(\*\*)?$/);
      if (emojiHeaderMatch) {
        flushList();
        const emoji = emojiHeaderMatch[2];
        const headerText = emojiHeaderMatch[3].replace(/\*\*/g, '');
        elements.push(
          <div 
            key={keyCounter++} 
            className="flex items-center gap-2 mt-4 mb-2 pb-1.5 border-b border-border/50"
          >
            <span className="text-lg">{emoji}</span>
            <h4 className="font-semibold text-sm text-foreground">{headerText}</h4>
          </div>
        );
        continue;
      }

      // Headers with ** at start (without emoji)
      if (trimmedLine.match(/^\*\*[^*]+\*\*$/)) {
        flushList();
        const headerText = trimmedLine.replace(/\*\*/g, '');
        elements.push(
          <div 
            key={keyCounter++} 
            className="flex items-center gap-2 mt-4 mb-2"
          >
            <span className="w-1 h-5 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
            <h4 className="font-semibold text-sm text-foreground">{headerText}</h4>
          </div>
        );
        continue;
      }

      // Section headers (text ending with :)
      if (trimmedLine.match(/^[A-ZÁÉÍÓÚÑ].+:$/) && !trimmedLine.includes('•')) {
        flushList();
        elements.push(
          <div 
            key={keyCounter++} 
            className="flex items-center gap-2 mt-4 mb-2"
          >
            <span className="w-1 h-5 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
            <h4 className="font-semibold text-sm text-foreground">{trimmedLine}</h4>
          </div>
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
          <p key={keyCounter++} className="text-sm leading-relaxed my-2 flex items-start gap-2">
            <span className="flex-shrink-0 text-base">{emojiPrefix[0]}</span>
            <span>{parseInline(trimmedLine.slice(emojiPrefix[0].length).trim())}</span>
          </p>
        );
      } else {
        elements.push(
          <p key={keyCounter++} className="text-sm leading-relaxed my-1.5 text-muted-foreground">
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
      {parseContent(mainContent)}
      
      {/* Sources section */}
      {sources.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 mb-2">
            <Globe className="h-3.5 w-3.5 text-blue-500" />
            <span className="text-xs font-medium text-muted-foreground">Fuentes consultadas</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {sources.map((source) => {
              // Extract domain from URL
              let domain = source.url;
              try {
                domain = new URL(source.url).hostname.replace('www.', '');
              } catch {
                // Keep original if parsing fails
              }
              
              return (
                <a
                  key={source.index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md hover:bg-blue-500/20 transition-colors"
                >
                  <span className="font-medium">[{source.index}]</span>
                  <span className="truncate max-w-[150px]">{domain}</span>
                  <ExternalLink className="h-3 w-3 flex-shrink-0" />
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessageRenderer;
