import { describe, expect, it } from 'vitest'
import { raw, TemplateResult } from '../index.js'
import { jsxDEV } from '../jsx-dev-runtime.js'
import { Fragment, jsx, jsxs } from '../jsx-runtime.js'

describe('@zoxon/mater JSX runtime', () => {
  it('returns TemplateResult for intrinsic elements', () => {
    const view = <button type="button">Save</button>

    expect(view).toBeInstanceOf(TemplateResult)
    expect(view.html.value).toBe('<button type="button">Save</button>')
  })

  it('escapes string children by default', () => {
    const view = <div>{'<script>alert("x")</script>'}</div>

    expect(view.html.value).toBe('<div>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</div>')
  })

  it('keeps raw html explicit and trusted', () => {
    const view = <div>{raw('<b>ok</b>')}</div>

    expect(view.html.value).toBe('<div><b>ok</b></div>')
  })

  it('renders boolean attributes and class arrays', () => {
    const view = <input class={['field', false, 'field--active']} disabled={true} required={false} />

    expect(view.html.value).toBe('<input class="field field--active" disabled />')
  })

  it('uses className only when class is absent', () => {
    const classNameOnly = <div className="from-class-name"></div>
    const classWins = <div class="from-class" className="from-class-name"></div>

    expect(classNameOnly.html.value).toBe('<div class="from-class-name"></div>')
    expect(classWins.html.value).toBe('<div class="from-class"></div>')
  })

  it('renders style objects as kebab-case css', () => {
    const view = <div style={{ marginTop: '4px', zIndex: 2, color: null }}></div>

    expect(view.html.value).toBe('<div style="margin-top:4px;z-index:2;"></div>')
  })

  it('renders fragments without a wrapper', () => {
    const view = (
      <>
        <span>A</span>
        <span>B</span>
      </>
    )

    expect(view.html.value).toBe('<span>A</span><span>B</span>')
  })

  it('calls function components with props and children', () => {
    function Label({ children, tone }: { children: string, tone: string }) {
      return <span class={['label', `label--${tone}`]}>{children}</span>
    }

    const view = <Label tone="info">Ready</Label>

    expect(view.html.value).toBe('<span class="label label--info">Ready</span>')
  })

  it('omits boolean children', () => {
    const view = (
      <div>
        {false}
        {true}
        {null}
        {undefined}
        <span>Done</span>
      </div>
    )

    expect(view.html.value).toBe('<div><span>Done</span></div>')
  })

  it('exports callable jsx helpers', () => {
    expect(jsx('div', { children: 'A' }).html.value).toBe('<div>A</div>')
    expect(jsxs('div', { children: ['A', 'B'] }).html.value).toBe('<div>AB</div>')
    expect(Fragment({ children: ['A', 'B'] }).html.value).toBe('AB')
    expect(jsxDEV('div', { children: 'A' }).html.value).toBe('<div>A</div>')
  })
})
