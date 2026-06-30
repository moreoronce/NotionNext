import { normalizeGeneratedMarkdown } from '@/lib/utils/markdown'

jest.mock('p-limit', () => () => callback => callback())

describe('normalizeGeneratedMarkdown', () => {
  it('converts Notion HTML tables to markdown pipe tables', () => {
    const markdown = `### 架构哲学
<table header-row="true">
<tr>
<td></td>
<td>MosDNS</td>
<td>SmartDNS</td>
<td>KixDNS</td>
</tr>
<tr>
<td>核心模型</td>
<td>\`sequence\` → \`parallel\` → \`fallback\`</td>
<td>多上游测速取最快IP</td>
<td>\`pipeline_select\` → 两阶段匹配</td>
</tr>
</table>`

    expect(normalizeGeneratedMarkdown(markdown)).toContain(`|  | MosDNS | SmartDNS | KixDNS |
| --- | --- | --- | --- |
| 核心模型 | \`sequence\` → \`parallel\` → \`fallback\` | 多上游测速取最快IP | \`pipeline_select\` → 两阶段匹配 |`)
  })

  it('does not rewrite tables inside fenced code blocks', () => {
    const markdown = '```html\n<table><tr><td>A</td></tr></table>\n```'

    expect(normalizeGeneratedMarkdown(markdown)).toBe(markdown)
  })
})
