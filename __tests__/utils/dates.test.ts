import { toLogDate } from '../../utils/dates';

describe('toLogDate', () => {
  it('formats in device-local time', () => {
    expect(toLogDate(new Date(2026, 0, 5, 0, 30))).toBe('2026-01-05');
  });

  it('keeps 23:59 on the same local day', () => {
    expect(toLogDate(new Date(2026, 11, 31, 23, 59))).toBe('2026-12-31');
  });
});
