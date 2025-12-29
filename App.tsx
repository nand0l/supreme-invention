import React from 'react';
import NovaPromptTool from './NovaPromptTool';

const App: React.FC = () => {
    return (
        <div className="App">
            <NovaPromptTool apiEndpoint="https://q273ry0qui.execute-api.us-east-1.amazonaws.com/prod/nova" />
        </div>
    );
};

export default App;