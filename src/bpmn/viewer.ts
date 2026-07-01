import BpmnModeler from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';

export class BpmnManager {
  private modeler: any;
  private container: HTMLElement;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
    this.modeler = new BpmnModeler({
      container: this.container,
      keyboard: { bindTo: this.container }
    });

    // Chặn Enter bị bpmn-js nuốt khi đang gõ trong label
    this.container.addEventListener('keydown', (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isEditing =
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'INPUT' ||
        target.isContentEditable ||
        target.closest('.djs-direct-editing-parent') !== null;

      if (e.key === 'Enter' && isEditing) {
        e.stopPropagation(); // Ngăn bpmn-js bắt Enter
        // KHÔNG e.preventDefault() — để trình duyệt xử lý xuống dòng bình thường
      }
    }, true); // true = capture phase, chạy trước bpmn-js
  }

  async render(xml: string): Promise<void> {
    const oldError = this.container.querySelector('.bpmn-error-msg');
    if (oldError) {
      oldError.remove();
    }

    try {
      await this.modeler.importXML(xml);
      const canvas = this.modeler.get('canvas');
      try {
        canvas.zoom('fit-viewport', 'auto');
      } catch (zoomErr) {
        console.warn('Không thể auto-zoom (File XML thiếu tọa độ đồ họa):', zoomErr);
      }
    } catch (err) {
      console.error('Error rendering BPMN:', err);
      const errorEl = document.createElement('p');
      errorEl.className = 'bpmn-error-msg';
      errorEl.style.color = 'red';
      errorEl.style.position = 'absolute';
      errorEl.style.top = '10px';
      errorEl.style.left = '20px';
      errorEl.style.zIndex = '100';
      errorEl.innerText = 'File BPMN không hợp lệ hoặc bị lỗi cú pháp. Hãy kiểm tra lại (F12).';
      this.container.appendChild(errorEl);
    }
  }

  async saveXML(): Promise<string> {
    const { xml } = await this.modeler.saveXML({ format: true });
    return xml;
  }

  async getSvg(): Promise<string> {
    const { svg } = await this.modeler.saveSVG({ format: true });
    return svg;
  }
}