import { BpmnManager } from './bpmn/viewer';
import { UmlManager } from './uml/viewer';
import { ExporterUtils } from './parser/file-parser';
import { DrawioExporter } from './drawio/exporter';

document.addEventListener('DOMContentLoaded', () => {
  const fileInput    = document.getElementById('fileInput')    as HTMLInputElement;
  const diagramType  = document.getElementById('diagramType')  as HTMLSelectElement;
  const btnSvg       = document.getElementById('btnSvg')       as HTMLButtonElement;
  const btnPng       = document.getElementById('btnPng')       as HTMLButtonElement;
  const btnDrawio    = document.getElementById('btnDrawio')    as HTMLButtonElement;
  const canvasBpmn   = document.getElementById('canvas-bpmn') as HTMLElement;
  const canvasUml    = document.getElementById('canvas-uml')  as HTMLElement;

  // Mỗi manager gắn với 1 container riêng — không bao giờ tranh nhau
  const bpmnManager = new BpmnManager('canvas-bpmn');
  const umlManager  = new UmlManager('canvas-uml');

  let currentContent = '';
  let currentType    = 'bpmn';

  // Ẩn/hiện đúng canvas theo loại diagram
  function switchCanvas(type: string) {
    canvasBpmn.style.display = type === 'bpmn' ? 'block' : 'none';
    canvasUml.style.display  = type === 'uml'  ? 'block' : 'none';
  }

  fileInput.addEventListener('change', (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    currentType = diagramType.value;
    switchCanvas(currentType);

    const reader = new FileReader();
    reader.onload = async (event) => {
      currentContent = event.target?.result as string;
      if (currentType === 'bpmn') await bpmnManager.render(currentContent);
      else await umlManager.render(currentContent);
    };
    reader.readAsText(file);
  });

  diagramType.addEventListener('change', () => {
    if (currentContent) {
      currentType = diagramType.value;
      switchCanvas(currentType);
      if (currentType === 'bpmn') bpmnManager.render(currentContent);
      else umlManager.render(currentContent);
    }
  });

  const getCurrentSvg = async () => {
    return currentType === 'bpmn'
      ? await bpmnManager.getSvg()
      : await umlManager.getSvg();
  };

  btnSvg.addEventListener('click', async () => {
    const svg = await getCurrentSvg();
    if (svg) ExporterUtils.downloadFile(svg, `diagram.svg`, 'image/svg+xml');
  });

  btnPng.addEventListener('click', async () => {
    const svg = await getCurrentSvg();
    if (svg) {
      const pngBase64  = await ExporterUtils.svgToPngBase64(svg);
      const base64Data = pngBase64.replace(/^data:image\/png;base64,/, '');
      const byteCharacters = atob(base64Data);
      const byteNumbers    = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const blob = new Blob([new Uint8Array(byteNumbers)], { type: 'image/png' });
      const a    = document.createElement('a');
      a.href     = URL.createObjectURL(blob);
      a.download = 'diagram.png';
      a.click();
    }
  });

  btnDrawio.addEventListener('click', async () => {
    const svg = await getCurrentSvg();
    if (svg) {
      const base64Svg = btoa(unescape(encodeURIComponent(svg)));
      const drawioXml = DrawioExporter.export(base64Svg, 800, 600);
      ExporterUtils.downloadFile(drawioXml, `diagram.drawio`, 'application/xml');
    }
  });
});