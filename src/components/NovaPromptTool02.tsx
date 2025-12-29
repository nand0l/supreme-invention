import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { NOVA_MODELS, DEFAULT_NOVA_MODEL } from './novaModels';

type Props = {
    apiEndpoint: string; // e.g., "https://q273ry0qui.execute-api.us-east-1.amazonaws.com/prod/nova"
};

const DEFAULT_SCRIPT = `You are a: AWS Certified Solutions Architect - Professional an AWS Certified Solutions Architect - Professional certified individuals showcase advanced knowledge and skills in providing complex solutions to complex problems, optimizing security, cost, and performance, and automating manual processes. This certification is a means for organizations to identify and develop talent with these critical skills for implementing cloud initiatives.
I will provide you with a multiplechoice question about AWS Certified Solutions Architect - Professional, and you will respond with the correct answer and an explanation of the correct answer.
There are no assumtions, the complete environment and circumstances are descriged for the other things you tyhe default settings shoud be interpeted.
The markdown header for your output should be "##" because the first header is already used for the title.
Here is the question:
`;

export default function NovaPromptTool({ apiEndpoint }: Props) {
    const [model, setModel] = useState(DEFAULT_NOVA_MODEL);
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
                    <h1>Amazon Bedrock — Nova Prompt v2</h1>
                    <div className="card">
                        <div className="card__body">
                            <div className="margin-bottom--sm">
                                <label htmlFor="model" className="margin-right--sm"><strong>Choose a model:</strong></label>
                                <select id="model" className="margin-bottom--sm" value={model} onChange={(e) => setModel(e.target.value)}>
                                    {NOVA_MODELS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
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
