import { Injectable } from '@angular/core';
import { ConfiguracaoService } from './configuracao.service';
import { BehaviorSubject, Observable } from 'rxjs';

export interface SpeechStatus {
  speaking: boolean;
  paused: boolean;
  text: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class SpeechService {
  private synthesis: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance | null = null;

  // Estado observável da fala
  private statusSubject = new BehaviorSubject<SpeechStatus>({
    speaking: false,
    paused: false,
    text: null
  });

  public status$: Observable<SpeechStatus> = this.statusSubject.asObservable();

  // Configurações customizáveis
  private customRate: number | null = null;
  private customVolume: number | null = null;
  private customLanguage: string | null = null;

  constructor(private configuracaoService: ConfiguracaoService) {
    this.synthesis = window.speechSynthesis;
    this.verificarSuporteNavegador();
  }

  // ==========================================
  // VERIFICAÇÕES
  // ==========================================
  private verificarSuporteNavegador(): void {
    if (!('speechSynthesis' in window)) {
      console.error('Web Speech API não é suportada neste navegador');
    }
  }

  private podeUsarVoz(): boolean {
    const config = this.configuracaoService.getConfiguracao();
    return config?.habilitarSom ?? true;
  }

  // ==========================================
  // MÉTODOS PRINCIPAIS
  // ==========================================
  speak(text: string, forcar: boolean = false): void {
    // Se som desabilitado e não forçado, não fala
    if (!forcar && !this.podeUsarVoz()) {
      console.log('Voz desabilitada nas configurações');
      return;
    }

    if (!text || text.trim().length === 0) {
      console.warn('Texto vazio, não há nada para falar');
      return;
    }

    // Cancelar fala anterior se existir
    this.stop();

    // Pega configurações
    const config = this.configuracaoService.getConfiguracao();

    // Cria nova utterance
    this.utterance = new SpeechSynthesisUtterance(text);

    // Aplica configurações (custom tem prioridade)
    this.utterance.lang = this.customLanguage || config?.idiomaVoz || 'pt-BR';
    this.utterance.rate = this.customRate ?? (config?.velocidadeVoz || 100) / 100;
    this.utterance.volume = this.customVolume ?? (config?.velocidadeVoz || 100) / 100;
    this.utterance.pitch = 1;

    // Tenta selecionar voz em português
    const voices = this.synthesis.getVoices();
    const ptVoice = voices.find(v => v.lang.startsWith('pt'));
    if (ptVoice) {
      this.utterance.voice = ptVoice;
    }

    // Event listeners
    this.utterance.onstart = () => {
      this.statusSubject.next({
        speaking: true,
        paused: false,
        text: text
      });
    };

    this.utterance.onend = () => {
      this.statusSubject.next({
        speaking: false,
        paused: false,
        text: null
      });
    };

    this.utterance.onerror = (event) => {
      console.error('Erro na síntese de voz:', event);
      this.statusSubject.next({
        speaking: false,
        paused: false,
        text: null
      });
    };

    this.utterance.onpause = () => {
      this.statusSubject.next({
        speaking: true,
        paused: true,
        text: text
      });
    };

    this.utterance.onresume = () => {
      this.statusSubject.next({
        speaking: true,
        paused: false,
        text: text
      });
    };

    // Inicia a fala
    try {
      this.synthesis.speak(this.utterance);
    } catch (error) {
      console.error('Erro ao iniciar fala:', error);
    }
  }

  stop(): void {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.statusSubject.next({
        speaking: false,
        paused: false,
        text: null
      });
    }
  }

  pause(): void {
    if (this.synthesis.speaking && !this.synthesis.paused) {
      this.synthesis.pause();
    }
  }

  resume(): void {
    if (this.synthesis.paused) {
      this.synthesis.resume();
    }
  }

  // ==========================================
  // CONFIGURAÇÕES CUSTOMIZADAS
  // ==========================================
  setRate(rate: number): void {
    // Rate válido: 0.1 a 10 (padrão: 1)
    this.customRate = Math.max(0.1, Math.min(10, rate));
  }

  setVolume(volume: number): void {
    // Volume válido: 0 a 1
    this.customVolume = Math.max(0, Math.min(1, volume));
  }

  setLanguage(lang: string): void {
    this.customLanguage = lang;
  }

  resetCustomSettings(): void {
    this.customRate = null;
    this.customVolume = null;
    this.customLanguage = null;
  }

  // ==========================================
  // GETTERS DE ESTADO
  // ==========================================
  isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  isPaused(): boolean {
    return this.synthesis.paused;
  }

  getCurrentText(): string | null {
    return this.statusSubject.value.text;
  }

  // ==========================================
  // VOZES DISPONÍVEIS
  // ==========================================
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices();
  }

  getPortugueseVoices(): SpeechSynthesisVoice[] {
    return this.synthesis.getVoices().filter(v => v.lang.startsWith('pt'));
  }

  setVoice(voiceName: string): void {
    const voices = this.synthesis.getVoices();
    const selectedVoice = voices.find(v => v.name === voiceName);

    if (selectedVoice && this.utterance) {
      this.utterance.voice = selectedVoice;
    }
  }

  // ==========================================
  // UTILITÁRIOS
  // ==========================================

  /**
   * Fala um texto curto com feedback rápido
   * Útil para confirmações de ações
   */
  speakShort(text: string): void {
    const originalRate = this.customRate;
    this.setRate(1.2); // Fala um pouco mais rápido
    this.speak(text, true); // Força mesmo se som desabilitado

    // Restaura rate após 2 segundos
    setTimeout(() => {
      if (originalRate !== null) {
        this.setRate(originalRate);
      } else {
        this.customRate = null;
      }
    }, 2000);
  }

  /**
   * Soletra uma palavra letra por letra
   * Útil para aprendizado de leitura
   */
  spell(text: string): void {
    const letters = text.split('');
    let index = 0;

    const speakNext = () => {
      if (index < letters.length) {
        const letter = letters[index];
        this.speak(letter, true);

        // Aguarda 800ms entre letras
        setTimeout(() => {
          index++;
          speakNext();
        }, 800);
      }
    };

    speakNext();
  }

  /**
   * Fala uma lista de itens com pausas
   */
  speakList(items: string[], pauseMs: number = 1000): void {
    let index = 0;

    const speakNext = () => {
      if (index < items.length) {
        this.speak(items[index], true);

        setTimeout(() => {
          index++;
          speakNext();
        }, pauseMs);
      }
    };

    speakNext();
  }

  /**
   * Reproduz um beep sonoro (feedback auditivo)
   */
  beep(frequency: number = 800, duration: number = 100): void {
    try {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.error('Erro ao reproduzir beep:', error);
    }
  }
}
