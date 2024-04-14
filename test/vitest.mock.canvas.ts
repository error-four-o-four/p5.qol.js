import { vi } from 'vitest';
import 'vitest-canvas-mock';

import { defineResizeTo, defineHTMLElementGetters } from './unit/helpers';

// stub for vitest-canvas-mock
vi.stubGlobal('jest', vi);

defineResizeTo();
defineHTMLElementGetters();
