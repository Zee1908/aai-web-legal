'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

interface LegalPageProps {
  type: 'tos' | 'privacy'
  title: string
}

export default function LegalPage({ type, title }: LegalPageProps) {
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState<string>('')
  const [effectiveDate, setEffectiveDate] = useState<string>('')

  const [errorMsg, setErrorMsg] = useState<string>('')

  useEffect(() => {
    async function fetchDoc() {
      try {
        console.log('Fetching document:', type)
        const { data, error } = await supabase
          .from('legal_documents')
          .select('content, version, effective_from')
          .eq('type', type)
          .eq('is_active', true)
          .maybeSingle()

        if (error) {
          console.error('Supabase Error:', error)
          setErrorMsg(`Error: ${error.message}`)
        } else if (data) {
          console.log('Data found:', data.version)
          
          // Trust the DB content if it's already markdown
          // Just ensure newlines are actual newlines, not escaped strings
          let cleanContent = data.content || '';
          cleanContent = cleanContent.replace(/\\n/g, '\n');
          
          setContent(cleanContent)
          setVersion(data.version)
          setEffectiveDate(data.effective_from ? new Date(data.effective_from).toLocaleDateString() : '')
        } else {
          console.warn('No active document found for type:', type)
          setErrorMsg('No active document found in database.')
        }
      } catch (e: any) {
        console.error('Unexpected error:', e)
        setErrorMsg(`Unexpected error: ${e.message || e}`)
      } finally {
        setLoading(false)
      }
    }

    fetchDoc()
  }, [type])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="bg-red-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
          <div className="text-red-100 text-sm">
            {version && <span>Version: {version}</span>}
            {effectiveDate && <span className="ml-4">Effective: {effectiveDate}</span>}
          </div>
        </div>
        
        <div className="p-6 sm:p-8 prose prose-red max-w-none">
          {errorMsg ? (
             <div className="p-4 bg-red-50 border border-red-200 rounded text-red-700">
               <p className="font-bold">Error loading content:</p>
               <pre className="mt-2 text-xs whitespace-pre-wrap">{errorMsg}</pre>
               <p className="mt-4 text-sm text-gray-600">Please check your internet connection or try again later.</p>
             </div>
          ) : (
            <ReactMarkdown 
              remarkPlugins={[remarkGfm, remarkBreaks]}
              components={{
                a: ({node, ...props}) => {
                  let href = props.href || '';
                  
                  // Handle internal app links
                  if (href === 'internal:privacy_policy') {
                    href = '/privacy';
                  } else if (href === 'internal:terms_of_service') {
                    href = '/terms';
                  }
                  
                  return (
                    <a {...props} href={href} className="text-red-600 hover:underline font-medium">
                      {props.children}
                    </a>
                  );
                }
              }}
            >
              {content || '_No content available._'}
            </ReactMarkdown>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Contact Us</h3>
            <p className="text-gray-600 mb-2">
              If you have any questions about this document, please contact us at:
            </p>
            <a 
              href="mailto:contact.allaboutinsurance@gmail.com" 
              className="text-red-600 hover:text-red-800 font-medium hover:underline"
            >
              contact.allaboutinsurance@gmail.com
            </a>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} All About Insurance. All rights reserved.
        </div>
      </div>
    </div>
  )
}
