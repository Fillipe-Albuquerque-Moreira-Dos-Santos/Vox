import { Injectable } from '@angular/core';
import { ConfiguracaoService } from './configuracao.service';

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  constructor(private configuracaoService: ConfiguracaoService) {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string): void {
    const config = this.configuracaoService.getConfiguracao();

    if (!config?.habilitarSom) {
      return;
    }

    // Cancelar fala anterior se existir
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.lang = config.idiomaVoz || 'pt-BR';
    this.utterance.rate = (config.velocidadeVoz || 100) / 100;
    this.utterance.pitch = 1;
    this.utterance.volume = 1;

    this.synthesis.speak(this.utterance);
  }

  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
    }
  }

  pause(): void {
    if (this.synthesis.speaking) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }
}
