import * as pdf from 'pdfjs-dist';
import worker from 'pdfjs-dist/build/pdf.worker.entry';

pdf.GlobalWorkerOptions.workerSrc = worker;
