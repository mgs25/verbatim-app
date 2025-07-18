// === drill-engine.component.ts ===
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DrillTextComponent } from './drill-text/drill-text.component';
import { DrillInputComponent } from './drill-input/drill-input.component';
import { DrillTextService } from '../../services/drill-text.service';
import { KeyStroke } from '../../models/interfaces/typed-char.interface';
import { SpecialKeys } from '../../core/constants/keys.constant';
import { DrillDifficulty } from '../../models/enums/drill-difficulty.enum';
import { DrillLength } from '../../models/enums/drill-length.enum';
import { DrillStats } from '../../models/interfaces/drill-stats.interface';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-drill-engine',
    standalone: true,
    imports: [
    CommonModule,
    DrillTextComponent,
    DrillInputComponent,
    NzCardModule,
    NzStatisticModule,
],
    templateUrl: './drill-engine.component.html',
    styleUrl: './drill-engine.component.scss',
})
export class DrillEngineComponent implements OnInit {
    @ViewChild(DrillInputComponent) drillInputComponent!: DrillInputComponent;

    isDrillActive: boolean = false;
    sourceText: string[][] = [];
    wordLocked: boolean[] = [];
    typedText: (KeyStroke | undefined)[][] = [];
    currentWordIndex: number = 0;
    currentCharIndex: number = 0;

    startTime: number = 0;
    totalTimeInSeconds: number = 60;
    remainingTime: string = '01:00';
    private endTime: number = 0;
    timerInterval!: any;

    wpm: number = 0;
    accuracy: number = 100;
    drillStats!: DrillStats;

    isInputFocused: boolean = true;

    constructor(
        private drillTextService: DrillTextService,
        private ngZone: NgZone,
    ) {}

    ngOnInit(): void {
        this.startDrill();
    }

    startDrill(): void {
        this.isDrillActive = true;

        this.drillStats = {
            wpm: 0,
            accuracy: 0,
            errorMap: {
                wordErrorMap: {},
                charErrorMap: {},
            },
            corrections: 0,
        };

        const words = this.drillTextService.getRandomDrillText(
            DrillDifficulty.Advanced,
            DrillLength.Long,
        );

        // add space for every word except last
        this.sourceText = words.map((word, i) => {
            const chars = word.split('');
            return i < words.length - 1 ? [...chars, ' '] : chars;
        });

        // create undefined 2d array with same source text structure
        this.typedText = this.sourceText.map((word) =>
            new Array(word.length).fill(undefined),
        );

        this.wordLocked = this.sourceText.map(() => false);

        this.currentWordIndex = 0;
        this.currentCharIndex = 0;
    }

    stopDrill(): void {
        // stop timer
        this.isDrillActive = false;
        this.stopTimer();

        // update WPM & accuracy in drill stats
        this.drillStats.wpm = this.wpm;
        this.drillStats.accuracy = this.accuracy;
    }

    resumeDrill(): void {
        this.focusInput(); // refocus the hidden input
    }

    onKeyTyped(value: string): void {
        if (value === 'CTRL_BACKSPACE') {
            this.clearCurrentWord();
            return;
        } else if (value === 'ESCAPE') {
            this.drillInputComponent.blurInput();
            return;
        }

        if (value === SpecialKeys.Backspace.toString()) {
            this.drillStats.corrections++;
            this.handleBackspace();
            return;
        }

        // start timer on first keystroke
        if (!this.startTime) this.startTimer();

        const currentWord = this.sourceText[this.currentWordIndex];

        const expectedChar = currentWord[this.currentCharIndex];
        const enteredChar = value;

        const isCharCorrect = expectedChar === enteredChar;

        // build char error map
        if (!isCharCorrect) {
            this.drillStats.errorMap.charErrorMap[expectedChar] ??= 0;
            this.drillStats.errorMap.charErrorMap[expectedChar]++;
        }

        if (this.currentCharIndex >= currentWord.length) return;

        // construct typedText array for input to drillText component
        this.typedText[this.currentWordIndex][this.currentCharIndex] = {
            key: value,
            correct: isCharCorrect,
        };

        this.currentCharIndex++;

        // word complete
        if (this.currentCharIndex === currentWord.length) {
            console.log(this.drillStats);
            const isWordCorrect = this.typedText[this.currentWordIndex].every(
                (stroke, i) =>
                    stroke?.key === this.sourceText[this.currentWordIndex][i],
            );

            // build word error map
            if (!isWordCorrect) {
                const currentWordTrimmed = currentWord.join('').trim();
                this.drillStats.errorMap.wordErrorMap[currentWordTrimmed] ??= 0;
                this.drillStats.errorMap.wordErrorMap[currentWordTrimmed]++;
            }

            // do not let user modify the completed correct words
            this.wordLocked[this.currentWordIndex] = isWordCorrect;

            this.drillInputComponent.clearDrillInput();
            this.currentWordIndex++;
            this.currentCharIndex = 0;

            if (this.currentWordIndex >= this.sourceText.length) {
                this.stopDrill();
                return;
            }
        }
    }

    clearCurrentWord(): void {
        // beginning of the word and it's not the first word
        if (this.currentCharIndex === 0 && this.currentWordIndex > 0) {
            const prevIndex = this.currentWordIndex - 1;

            // cannot clear locked word
            if (this.wordLocked[prevIndex]) {
                return;
            }

            const length = this.sourceText[prevIndex].length;
            this.typedText[prevIndex] = new Array(length).fill(undefined);
            this.currentWordIndex = prevIndex;
            this.currentCharIndex = 0;
            this.drillInputComponent.clearDrillInput();
            return;
        }

        if (this.wordLocked[this.currentWordIndex]) return;

        // clear current word if not locked
        const wordLength = this.sourceText[this.currentWordIndex]?.length ?? 0;

        // clear typed state for current word
        this.typedText[this.currentWordIndex] = new Array(wordLength).fill(
            undefined,
        );

        this.currentCharIndex = 0;
        this.drillInputComponent.clearDrillInput();
    }

    handleBackspace(): void {
        if (this.currentCharIndex === 0) {
            if (this.currentWordIndex === 0) return;

            // move to previous word
            const prevIndex = this.currentWordIndex - 1;

            // cannot backtrack to a locked word
            if (this.wordLocked[prevIndex]) return;

            this.currentWordIndex = prevIndex;
            this.currentCharIndex = this.sourceText[prevIndex].length;
        }

        this.currentCharIndex--;
        this.typedText[this.currentWordIndex][this.currentCharIndex] =
            undefined;
    }

    updateWPMAndAccuracy(): void {
        // only count actual typed characters
        const flattened = this.typedText.flat();
        const typedChars = flattened.filter((k) => k !== undefined);
        const correctChars = typedChars.filter((k) => k?.correct).length;

        const elapsedMinutes = (Date.now() - this.startTime) / 60000;

        this.wpm = Math.floor(correctChars / 5 / elapsedMinutes);

        const totalKeystrokes = typedChars.length;
        this.accuracy = totalKeystrokes
            ? Math.floor((correctChars / totalKeystrokes) * 100)
            : 100;
    }

    startTimer(): void {
        this.startTime = Date.now();
        this.endTime = this.startTime + this.totalTimeInSeconds * 1000;

        this.timerInterval = setInterval(() => {
            const msLeft = this.endTime - Date.now();
            const secondsLeft = Math.max(0, Math.floor(msLeft / 1000));
            const minutes = Math.floor(secondsLeft / 60);
            const seconds = secondsLeft % 60;

            this.remainingTime = `${this.pad(minutes)}:${this.pad(seconds)}`;
            this.updateWPMAndAccuracy();

            if (msLeft <= 0) {
                this.stopDrill(); // Auto-submit or end
            }
        }, 1000);
    }

    stopTimer(): void {
        clearInterval(this.timerInterval);
    }

    pad(num: number): string {
        return num.toString().padStart(2, '0');
    }

    focusInput() {
        this.drillInputComponent?.focusInput();
    }

    onInputFocus(): void {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.ngZone.run(() => {
                    this.isInputFocused = true;
                });
            });
        });
    }

    onInputBlur(): void {
        this.ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.ngZone.run(() => {
                    this.isInputFocused = false;
                });
            });
        });
    }
}
