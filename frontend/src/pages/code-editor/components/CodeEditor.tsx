import CodeMirror from '@uiw/react-codemirror';
import { sublime } from '@uiw/codemirror-theme-sublime';
import { python } from '@codemirror/lang-python';

type CodeEditorProps = {
  code: string;
  setCode: (val: string) => void;
};

const CodeEditor = ({ code, setCode }: CodeEditorProps) => {
  const handleCodeChange = (val: string) => {
    setCode(val);
  };

  return (
    <CodeMirror
      value={code}
      theme={sublime}
      extensions={[python()]}
      onChange={handleCodeChange}
    />
  );
};

export default CodeEditor;
