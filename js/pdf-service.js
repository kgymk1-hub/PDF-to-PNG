import { canvasToBlob, resizeCanvas, trimWhitespace } from './image-service.js';

let pdfjsPromise;

async function getPdfjs() {
  if (!pdfjsPromise) pdfjsPromise = import('../libs/pdf.min.js');
  const pdfjs = await pdfjsPromise;
  pdfjs.GlobalWorkerOptions.workerSrc = './libs/pdf.worker.min.js';
  return pdfjs;
}

export async function loadPdf(file) {
  const pdfjs = await getPdfjs();
  try {
    return await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  } catch (error) {
    if (error?.name === 'PasswordException') throw new Error('パスワード付きPDFには現在対応していません。');
    throw new Error('PDFの読み込みに失敗しました。ファイルが破損しているか、対応していない形式の可能性があります。');
  }
}

export async function renderPage(pdf, pageNumber, opts) {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: opts.scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);

  const alpha = opts.background === 'transparent' && opts.format === 'png';
  const backgroundColor = opts.background === 'black' ? '#000' : '#fff';
  const ctx = canvas.getContext('2d', { alpha });
  if (!alpha) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  await page.render({ canvasContext: ctx, viewport, background: alpha ? undefined : backgroundColor }).promise;

  const trimMode = opts.background === 'black' ? 'black' : opts.background === 'white' ? 'white' : 'white-only';
  let output = opts.trim && opts.background !== 'transparent' ? trimWhitespace(canvas, { background: backgroundColor, mode: trimMode }) : canvas;
  output = resizeCanvas(output, opts.width, backgroundColor);
  const blob = await canvasToBlob(output, opts.format, opts.quality / 100);
  return { blob, width: output.width, height: output.height };
}
