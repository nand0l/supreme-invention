import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Props = {
    apiEndpoint: string; // e.g., "https://q273ry0qui.execute-api.us-east-1.amazonaws.com/prod/nova"
};

const DEFAULT_SCRIPT = `You are an expert educational content writer. I will provide a summary with some bullet points. Your task is to rewrite it into a full-length article that can be included in a student syllabus module. The tone should be educational, clear, and supportive.

If any complex or technical terms are used, explain them in simple language suitable for students with mixed backgrounds. Use only ASCII characters and format the response in clean, readable Markdown. Structure the output with appropriate headings, subheadings, paragraphs, and bullet points.

Start the article with a short introduction and end with a summary or reflection section.
The markdown header for your output should be "##" because the first header is already used for the title.
Here is the summary:
`;

export default function NovaPromptTool({ apiEndpoint }: Props) {
    const [model, setModel] = useState('amazon.nova-pro-v1:0');
    const [scriptPrompt, setScriptPrompt] = useState(DEFAULT_SCRIPT);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [markdown, setMarkdown] = useState<string>('');
    const [error, setError] = useState<string>('');

    async function submitRequest() {
        setLoading(true);
        setError('');
        setMarkdown('');
        try {
            const res = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model_id: model,
                    script_prompt: scriptPrompt,
                    user_input: userInput,
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Request failed');
            setMarkdown(data?.result || '');
        } catch (e: any) {
            setError(e?.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }

    function downloadMarkdown() {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nova-output.md';
        a.click();
        URL.revokeObjectURL(url);
    }

    async function copyToClipboard() {
        try {
            await navigator.clipboard.writeText(markdown);
        } catch (e: any) {
            setError('Failed to copy: ' + (e?.message || String(e)));
        }
    }

    return (
        <div className="container padding-vert--lg">
            <div className="row">
                <div className="col col--12">
                    <h1>Amazon Bedrock — Nova Prompt</h1>
                    <div className="card">
                        <div className="card__body">
                            <div className="margin-bottom--sm">
                                <label htmlFor="model" className="margin-right--sm"><strong>Choose a model:</strong></label>
                                <select id="model" className="margin-bottom--sm" value={model} onChange={(e) => setModel(e.target.value)}>
                                    <option value="amazon.nova-pro-v1:0">amazon.nova-pro-v1:0</option>
                                    <option value="us.amazon.nova-lite-v1:0">us.amazon.nova-lite-v1:0</option>
                                    <option value="us.amazon.nova-micro-v1:0">us.amazon.nova-micro-v1:0</option>
                                    <option value="us.amazon.nova-premier-v1:0">us.amazon.nova-premier-v1:0</option>
                                </select>
                            </div>

                            <details className="margin-bottom--md">
                                <summary><strong>View Model Specifications / Script Prompt</strong></summary>
                                <textarea
                                    rows={10}
                                    className="margin-top--sm"
                                    style={{ width: '100%' }}
                                    value={scriptPrompt}
                                    onChange={(e) => setScriptPrompt(e.target.value)}
                                />
                            </details>

                            <div className="margin-bottom--md">
                                <label htmlFor="input"><strong>Enter your summary or bullet points:</strong></label>
                                <textarea
                                    id="input"
                                    rows={8}
                                    style={{ width: '100%' }}
                                    placeholder="Your summary..."
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                />
                            </div>

                            <button className="button button--primary" onClick={submitRequest} disabled={loading}>
                                {loading ? 'Processing…' : 'Submit'}
                            </button>

                            {error && (
                                <div className="alert alert--danger margin-top--md" role="alert">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>

                    {markdown && (
                        <div className="card margin-top--lg">
                            <div className="card__header">
                                <h3 className="card__title">Result</h3>
                            </div>
                            <div className="card__body">
                                <div className="markdown-body">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {markdown}
                                    </ReactMarkdown>
                                </div>
                                <div className="margin-top--md">
                                    <button className="button button--secondary margin-right--sm" onClick={downloadMarkdown}>
                                        Download Markdown
                                    </button>
                                    <button className="button button--secondary" onClick={copyToClipboard}>
                                        Copy to Clipboard
                                    </button>
                                </div>
                                <details className="margin-top--md">
                                    <summary>View Markdown Source</summary>
                                    <pre style={{ whiteSpace: 'pre-wrap' }}>{markdown}</pre>
                                </details>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
