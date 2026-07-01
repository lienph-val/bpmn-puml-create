export class DrawioExporter {
  static export(base64Image: string, width: number = 800, height: number = 600): string {
    const cleanBase64 = base64Image.replace(/^data:image\/(png|svg\+xml);base64,/, '');
    
    // Tạo cấu trúc chuẩn của file draw.io (.drawio / .xml)
    return `<mxfile host="Electron" modified="${new Date().toISOString()}" agent="NodeJS_Diagram_Viewer" version="21.6.8" type="device">
  <diagram id="diagram_1" name="Page-1">
    <mxGraphModel dx="1000" dy="1000" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="827" pageHeight="1169" math="0" shadow="0">
      <root>
        <mxCell id="0" />
        <mxCell id="1" parent="0" />
        <mxCell id="2" value="" style="shape=image;verticalLabelPosition=bottom;labelBackgroundColor=default;verticalAlign=top;aspect=fixed;imageAspect=0;image=data:image/svg+xml;base64,${cleanBase64};" vertex="1" parent="1">
          <mxGeometry x="40" y="40" width="${width}" height="${height}" as="geometry" />
        </mxCell>
      </root>
    </mxGraphModel>
  </diagram>
</mxfile>`;
  }
}