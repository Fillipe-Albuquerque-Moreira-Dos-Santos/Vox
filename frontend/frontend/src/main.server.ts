// 📁 src/main.server.ts
// SUBSTITUIR O CONTEÚDO EXISTENTE

import 'zone.js/node';
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

export default function bootstrap() {
  return bootstrapApplication(App, config);
}
