import React, { useState } from 'react';

interface Props {
  initial?: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

export default function ApiKeyModal({ initial = '', onSave, onClose }: Props) {
  const [key, setKey] = useState(initial);
  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <h2>GEMINI API KEY</h2>
        <p>
          Paste your <b>Google Gemini API key</b> below. Get one free at{' '}
          <a href="https://aistudio.google.com/apikey" target="_blank" rel="noreferrer">
            aistudio.google.com/apikey
          </a>.
          Your key is stored locally on this device only.
        </p>
        <input
          type="password"
          value={key}
          onChange={e => setKey(e.target.value)}
          placeholder="AIza..."
          autoFocus
        />
        <button className="btn" style={{ width: '100%' }} onClick={() => onSave(key)}>
          SAVE & ACTIVATE
        </button>
      </div>
    </div>
  );
}
