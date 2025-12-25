/**
 * JsonLd Component
 *
 * Utility component for injecting JSON-LD structured data into pages.
 * Helps Google understand content and enables rich search results.
 *
 * Usage:
 * import JsonLd from '@/components/JsonLd'
 *
 * <JsonLd data={schemaData} />
 */

interface JsonLdProps {
  data: object | object[];
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 0) // Minified for production
      }}
    />
  );
}
