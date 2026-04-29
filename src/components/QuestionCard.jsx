import React from 'react';

export default function QuestionCard({ title, content, followUp }) {
  return (
    <div className="panel-raised" style={{ 
      background: '#c0c0c0', 
      marginBottom: '20px', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div className="titlebar" style={{ background: 'var(--win-title-bg)', color: '#fff', padding: '6px 12px', fontWeight: 'bold', fontSize: '22px' }}>
        {title}
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ lineHeight: '1.6', fontSize: '20px' }}>
          {content}
        </div>
        
        {followUp && (
          <div style={{ 
            marginTop: '8px', 
            lineHeight: '1.6', 
            fontSize: '20px',
            background: '#e0e0e0',
            padding: '16px',
            borderLeft: '4px solid #808080'
          }}>
            {followUp}
          </div>
        )}
      </div>
    </div>
  );
}
