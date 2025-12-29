import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Types
interface NovaModel {
    value: string;
    label: string;
}

interface NovaPromptToolProps {
    apiEndpoint: string;
}

interface ApiResponse {
    result?: string;
    error?: string;
}

// Nova models configuration
const NOVA_MODELS: NovaModel[] = [
    { value: 'global.amazon.nova-2-lite-v1:0', label: 'amazon.nova-2-lite-v1:0' },
    { value: 'amazon.nova-pro-v1:0', label: 'amazon.nova-pro-v1:0' },
    { value: 'us.amazon.nova-lite-v1:0', label: 'us.amazon.nova-lite-v1:0' },
    { value: 'us.amazon.nova-micro-v1:0', label: 'us.amazon.nova-micro-v1:0' },
    { value: 'us.amazon.nova-premier-v1:0', label: 'us.amazon.nova-premier-v1:0' },
];

const DEFAULT_NOVA_MODEL: string = NOVA_MODELS[0].value;

const DEFAULT_SCRIPT = `You are an expert educational content writer. I will provide a summary with some bullet points. Your task is to rewrite it into a full-length article that can be included in a student syllabus module. The tone should be educational, clear, and supportive.

If any complex or technical terms are used, explain them in simple language suitable for students with mixed backgrounds. Use only ASCII characters and format the response in clean, readable Markdown. Structure the output with appropriate headings, subheadings, paragraphs, and bullet points.

Start the article with a short introduction and end with a summary or reflection section.
The markdown header for your output should be "##" because the first header is already used for the title.
Here is the summary:
`;

// Basic styles for the component
const styles: { [key: string]: React.CSSProperties } = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
    },
    card: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '1rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    textarea: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
        fontFamily: 'monospace',
    },
    select: {
        padding: '0.5rem',
        border: '1px solid #ccc',
        borderRadius: '4px',
        marginBottom: '1rem',
    },
    button: {
        padding: '0.75rem 1.5rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '0.5rem',
        marginBottom: '0.5rem',
    },
    buttonPrimary: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    buttonSecondary: {
        backgroundColor: '#6c757d',
        color: 'white',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
        cursor: 'not-allowed',
    },
    alert: {
        padding: '1rem',
        borderRadius: '4px',
        marginTop: '1rem',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        border: '1px solid #f5c6cb',
    },
    details: {
        marginBottom: '1rem',
    },
    summary: {
        cursor: 'pointer',
        fontWeight: 'bold',
        marginBottom: '0.5rem',
    },
    pre: {
        backgroundColor: '#f8f9fa',
        padding: '1rem',
        borderRadius: '4px',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        fontSize: '12px',
    },
    markdownBody: {
        lineHeight: '1.6',
        color: '#333',
    },
};

export default function NovaPromptTool({ apiEndpoint }: NovaPromptToolProps) {
    const [model, setModel] = useState < string > (DEFAULT_NOVA_MODEL);
    const [scriptPrompt, setScriptPrompt] = useState < string > (DEFAULT_SCRIPT);
    const [userInput, setUserInput] = useState < string > ('');
    const [loading, setLoading] = useState < boolean > (false);
    const [markdown, setMarkdown] = useState < string > ('');
    const [error, setError] = useState < string > ('');

    async function submitRequest(): Promise<void> {
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
            const data: ApiResponse = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Request failed');
            setMarkdown(data?.result || '');
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    function downloadMarkdown(): void {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nova-output.md';
        a.click();
        URL.revokeObjectURL(url);
    }

    async function copyToClipboard(): Promise<void> {
        try {
            await navigator.clipboard.writeText(markdown);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            setError('Failed to copy: ' + errorMessage);
        }
    }

    return (
        <div style={styles.container}>
            <h1>Amazon Bedrock — Nova Prompt v3</h1>
            <div style={styles.card}>
                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="model" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
                        Choose a model:
                    </label>
                    <select
                        id="model"
                        style={styles.select}
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                    >
                        {NOVA_MODELS.map((m: NovaModel) => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </div>

                <details style={styles.details}>
                    <summary style={styles.summary}>View Model Specifications / Script Prompt</summary>
                    <textarea
                        rows={10}
                        style={{ ...styles.textarea, marginTop: '0.5rem' }}
                        value={scriptPrompt}
                        onChange={(e) => setScriptPrompt(e.target.value)}
                    />
                </details>

                <div style={{ marginBottom: '1rem' }}>
                    <label htmlFor="input" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>
                        Enter your summary or bullet points:
                    </label>
                    <textarea
                        id="input"
                        rows={8}
                        style={styles.textarea}
                        placeholder="Your summary..."
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                    />
                </div>

                <button
                    style={{
                        ...styles.button,
                        ...(loading ? styles.buttonDisabled : styles.buttonPrimary)
                    }}
                    onClick={submitRequest}
                    disabled={loading}
                >
                    {loading ? 'Processing…' : 'Submit'}
                </button>

                {error && (
                    <div style={styles.alert} role="alert">
                        {error}
                    </div>
                )}
            </div>

            {markdown && (
                <div style={styles.card}>
                    <h3>Result</h3>
                    <div style={styles.markdownBody}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {markdown}
                        </ReactMarkdown>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <button
                            style={{ ...styles.button, ...styles.buttonSecondary }}
                            onClick={downloadMarkdown}
                        >
                            Download Markdown
                        </button>
                        <button
                            style={{ ...styles.button, ...styles.buttonSecondary }}
                            onClick={copyToClipboard}
                        >
                            Copy to Clipboard
                        </button>
                    </div>
                    <details style={{ marginTop: '1rem' }}>
                        <summary style={styles.summary}>View Markdown Source</summary>
                        <pre style={styles.pre}>{markdown}</pre>
                    </details>
                </div>
            )}
        </div>
    );
}