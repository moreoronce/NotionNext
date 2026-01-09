/**
 * 终端风格卡片组件
 */
export default function TerminalCard({ title, readonly, children, className = '' }) {
    return (
        <div className={`terminal-card ${className}`}>
            {/* 终端头部 */}
            <div className="terminal-header">

                {title && <span className="terminal-title">{title}</span>}
                {readonly && <span className="terminal-title ml-auto">readonly</span>}
            </div>

            {/* 内容区域 */}
            <div className="terminal-body">
                {children}
            </div>
        </div>
    )
}



