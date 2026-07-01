import plantumlEncoder from 'plantuml-encoder';

export class UmlManager {
  private container: HTMLElement;
  private currentSvgUrl: string = '';

  constructor(containerId: string) {
    this.container = document.getElementById(containerId) as HTMLElement;
  }

  async render(content: string): Promise<void> {
    try {
      this.container.innerHTML = '<p>Rendering UML...</p>';
      const encoded = plantumlEncoder.encode(content);
      this.currentSvgUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`;
      
      const response = await fetch(this.currentSvgUrl);
      const svgText = await response.text();
      
      this.container.innerHTML = svgText;
      const svgEl = this.container.querySelector('svg');
      
      if (svgEl) {
        // --- ĐÃ FIX: Giữ nguyên tỷ lệ gốc của sơ đồ ---
        svgEl.style.width = 'auto';     
        svgEl.style.height = 'auto';
        svgEl.style.maxWidth = 'none'; // Cho phép cuộn ngang nếu sơ đồ quá lớn
        
        // Căn giữa biểu đồ vào giữa màn hình cho đẹp
        svgEl.style.display = 'block';
        svgEl.style.margin = '20px auto';
      }
    } catch (err) {
      console.error('Error rendering UML:', err);
      this.container.innerHTML = `<p style="color:red">Failed to render UML. Check console.</p>`;
    }
  }

  async getSvg(): Promise<string> {
    const svgEl = this.container.querySelector('svg');
    return svgEl ? svgEl.outerHTML : '';
  }
}