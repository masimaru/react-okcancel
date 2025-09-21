import { useState } from 'react';
import { OkCancelProvider, useOkCancel } from './index';
import styles from './App.module.scss';
import './code-highlight.css';

interface CodeBlockProps {
  title: string;
  code: string;
}

function CodeBlock({ title, code }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const highlightCode = (code: string) => {
    // HTML escape first
    let highlighted = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Apply syntax highlighting
    highlighted = highlighted
      // Comments first (to avoid conflicts)
      .replace(/\/\/.*$/gm, '<span class="comment">$&</span>')
      // Strings
      .replace(/(["'`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="string">$1$2$1</span>')
      // Keywords
      .replace(
        /\b(import|export|from|const|let|var|function|return|if|else|await|async|true|false|null|undefined)\b/g,
        '<span class="keyword">$1</span>',
      )
      // Functions (react-okcancel specific)
      .replace(
        /\b(confirm|alert|useOkCancel|OkCancelProvider)\b/g,
        '<span class="function">$1</span>',
      )
      // Properties (word followed by colon, but not inside strings)
      .replace(/\b(\w+)(?=\s*:(?![^"]*"[^"]*$))/g, '<span class="property">$1</span>')
      // Punctuation
      .replace(/([{}()[\],;:])/g, '<span class="punctuation">$1</span>');

    return highlighted;
  };

  return (
    <div className={styles['code-block-container']}>
      <div className={styles['code-block-header']}>
        <h3 className={styles['code-block-title']}>{title}</h3>
        <button onClick={handleCopy} className={styles['copy-button']}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre
        className={styles['code-block']}
        dangerouslySetInnerHTML={{ __html: highlightCode(code) }}
      />
    </div>
  );
}

function InteractivePlayground() {
  const { confirm, alert } = useOkCancel();
  const [lastResult, setLastResult] = useState('');
  const [options, setOptions] = useState({
    type: 'confirm' as 'confirm' | 'alert',
    title: '확인',
    description: '정말로 삭제하시겠습니까?',
    confirmText: '삭제',
    cancelText: '',
    canCloseOnOverlay: true,
    canCloseOnEsc: true,
  });

  const generateCodeExample = () => {
    const optionsObj: Record<string, string | boolean> = {};

    if (options.title) optionsObj.title = options.title;
    if (options.description) optionsObj.description = options.description;
    if (options.confirmText) optionsObj.confirmText = options.confirmText;
    if (options.type === 'confirm' && options.cancelText)
      optionsObj.cancelText = options.cancelText;
    if (!options.canCloseOnOverlay) optionsObj.canCloseOnOverlay = false;
    if (!options.canCloseOnEsc) optionsObj.canCloseOnEsc = false;

    const hasOptions = Object.keys(optionsObj).length > 0;
    const optionsStr = hasOptions
      ? '{\n  ' +
        Object.entries(optionsObj)
          .map(([key, value]) => `${key}: ${typeof value === 'string' ? `'${value}'` : value}`)
          .join(',\n  ') +
        '\n}'
      : '';

    if (options.type === 'confirm') {
      return `const result = await confirm(${optionsStr || ''});`;
    } else {
      return `await alert(${optionsStr || ''});`;
    }
  };

  const handleTest = async () => {
    if (options.type === 'confirm') {
      const result = await confirm({
        title: options.title || undefined,
        description: options.description || undefined,
        confirmText: options.confirmText || undefined,
        cancelText: options.cancelText || undefined,
        canCloseOnOverlay: options.canCloseOnOverlay,
        canCloseOnEsc: options.canCloseOnEsc,
      });
      setLastResult(`Confirm 결과: ${result ? 'true' : 'false'}`);
    } else if (options.type === 'alert') {
      await alert({
        title: options.title || undefined,
        description: options.description || undefined,
        confirmText: options.confirmText || undefined,
        canCloseOnOverlay: options.canCloseOnOverlay,
        canCloseOnEsc: options.canCloseOnEsc,
      });
      setLastResult('Alert 완료');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['main-container']}>
        <div className={styles['left-panel']}>
          <div className={styles['code-examples']}>
            <h2 className={styles['code-examples-title']}>Code Example</h2>
            <CodeBlock
              title={`${options.type === 'confirm' ? 'Confirm' : 'Alert'} Usage`}
              code={generateCodeExample()}
            />
          </div>
        </div>
        <div className={styles['right-panel']}>
          <h2 className={styles['code-examples-title']}>Playground</h2>
          <div className={styles.controls}>
            <div className={styles['control-group']}>
              <label className={styles.label}>타입:</label>
              <div className={styles['radio-group']}>
                <label className={styles['radio-label']}>
                  <input
                    type="radio"
                    name="type"
                    value="confirm"
                    checked={options.type === 'confirm'}
                    onChange={(e) => setOptions({ ...options, type: e.target.value as 'confirm' })}
                  />
                  Confirm
                </label>
                <label className={styles['radio-label']}>
                  <input
                    type="radio"
                    name="type"
                    value="alert"
                    checked={options.type === 'alert'}
                    onChange={(e) => setOptions({ ...options, type: e.target.value as 'alert' })}
                  />
                  Alert
                </label>
              </div>
            </div>

            <div className={styles['control-group']}>
              <label className={styles.label}>Title (optional):</label>
              <input
                type="text"
                value={options.title}
                onChange={(e) => setOptions({ ...options, title: e.target.value })}
                className={styles.input}
                placeholder="다이얼로그 제목 (비워두면 undefined)"
              />
            </div>

            <div className={styles['control-group']}>
              <label className={styles.label}>Description (optional):</label>
              <textarea
                value={options.description}
                onChange={(e) => setOptions({ ...options, description: e.target.value })}
                className={styles.textarea}
                placeholder="다이얼로그 설명 (비워두면 undefined)"
                rows={3}
              />
            </div>

            <div className={styles['control-group']}>
              <label className={styles.label}>Confirm Text (optional):</label>
              <input
                type="text"
                value={options.confirmText}
                onChange={(e) => setOptions({ ...options, confirmText: e.target.value })}
                className={styles.input}
                placeholder="확인 버튼 텍스트 (비워두면 기본값)"
              />
            </div>

            <div className={styles['control-group']}>
              <label className={styles.label}>Cancel Text (optional):</label>
              <input
                type="text"
                value={options.cancelText}
                onChange={(e) => setOptions({ ...options, cancelText: e.target.value })}
                className={styles.input}
                placeholder="취소 버튼 텍스트 (비워두면 기본값)"
                disabled={options.type !== 'confirm'}
              />
            </div>

            <div className={styles['control-group']}>
              <label className={styles['checkbox-label']}>
                <input
                  type="checkbox"
                  checked={options.canCloseOnOverlay}
                  onChange={(e) => setOptions({ ...options, canCloseOnOverlay: e.target.checked })}
                  className={styles.checkbox}
                />
                Can Close On Overlay
              </label>
            </div>

            <div className={styles['control-group']}>
              <label className={styles['checkbox-label']}>
                <input
                  type="checkbox"
                  checked={options.canCloseOnEsc}
                  onChange={(e) => setOptions({ ...options, canCloseOnEsc: e.target.checked })}
                  className={styles.checkbox}
                />
                Can Close On ESC
              </label>
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={handleTest} className={styles['test-button']}>
              Test Dialog
            </button>
            {lastResult && <div className={styles.result}>{lastResult}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <OkCancelProvider>
      <InteractivePlayground />
    </OkCancelProvider>
  );
}
