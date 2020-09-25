import { ipcRenderer } from 'electron';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { KeyNote } from '../../data/midi-hex-table';
import { MusicSymbolDrawer, SymbolState } from '../utils/musical-symbol-drawer';

interface SheetmusciViewProps {
  pianoConnected: boolean;
}

export class SheetmusicView extends React.PureComponent<SheetmusciViewProps, { keysPressed: KeyNote[] }> {
  private canvas: HTMLCanvasElement | undefined;
  private musicSymbolDrawer: MusicSymbolDrawer | undefined;

  private assertCanvas(canvas: unknown): asserts canvas is HTMLCanvasElement {
    if (canvas == null || !(canvas instanceof HTMLCanvasElement)) {
      throw new Error('Canvas was not found');
    }
  }

  constructor(props: SheetmusciViewProps) {
    super(props);

    this.state = {
      keysPressed: []
    }
  }

  componentDidMount(): void {
    // TODO: Dynamic initial SymbolState
    const initialSymbolState: SymbolState = { trebleClef: true, bassClef: false };
    ipcRenderer.on('keys-pressed', (_, options) => {
      this.setState({ keysPressed: options.keysPressed });
      this.musicSymbolDrawer?.draw(Object.assign(initialSymbolState, { notes: this.state.keysPressed}));
    });

    this.assertCanvas(this.canvas);
    this.musicSymbolDrawer = new MusicSymbolDrawer(this.canvas, window, initialSymbolState);
  }

  private setCanvasRef = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
  }

  public render(): JSX.Element {
    return (
      <div>
          <h1>Sheetmusic</h1>
          <Link to="/">Home</Link>
          
          <div className={this.props.pianoConnected ? '' : '' /*'pointer-events-none opacity-50'*/}>
            <canvas ref={this.setCanvasRef} width={800} height={500} className="border"/>
            <h1>Key pressed: {this.state.keysPressed.map(k => k.note).join(', ')}</h1>
          </div>
      </div>
    );
  }
}