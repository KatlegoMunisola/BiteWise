import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../constants/theme';

/**
 * Flat, on-brand onboarding illustrations built from plain RN primitives
 * (no image assets, no SVG library) — renders identically everywhere,
 * ships with zero extra native dependencies, and updates instantly via
 * Fast Refresh instead of requiring a native rebuild.
 */

const CARD_SIZE = 236;

function Card({ children }: { children: React.ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function TrackIllustration() {
  return (
    <Card>
      <View style={styles.clipboard}>
        <View style={styles.clipboardClip} />
        <ChecklistRow checked width="72%" />
        <ChecklistRow width="88%" />
        <ChecklistRow width="60%" />
      </View>
      <View style={styles.trackBadge}>
        <MiniBar height={10} />
        <MiniBar height={18} />
        <MiniBar height={14} />
      </View>
    </Card>
  );
}

function ChecklistRow({ checked, width }: { checked?: boolean; width: `${number}%` }) {
  return (
    <View style={styles.checklistRow}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <View style={[styles.checklistLine, { width }]} />
    </View>
  );
}

function MiniBar({ height }: { height: number }) {
  return <View style={[styles.miniBar, { height }]} />;
}

export function AllergenIllustration() {
  const barcodeWidths = [3, 6, 3, 8, 4, 3, 7, 4];
  return (
    <Card>
      <View style={styles.shield}>
        <View style={styles.barcodeRow}>
          {barcodeWidths.map((w, i) => (
            <View key={i} style={[styles.barcodeBar, { width: w }]} />
          ))}
        </View>
      </View>
      <View style={styles.alertDot}>
        <Text style={styles.alertMark}>!</Text>
      </View>
      <View style={styles.magnifier}>
        <View style={styles.magnifierGlass} />
        <View style={styles.magnifierHandle} />
      </View>
    </Card>
  );
}

export function InsightIllustration() {
  const bars = [22, 40, 30, 54, 68];
  return (
    <Card>
      <View style={styles.bulb} />
      <View style={styles.bulbBase} />
      <View style={styles.trendRow}>
        {bars.map((h, i) => (
          <View key={i} style={[styles.trendBar, { height: h }]} />
        ))}
      </View>
      <View style={styles.confidenceBadge}>
        <Text style={styles.checkmark}>✓</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderRadius: radius.lg + 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Track
  clipboard: {
    width: 150,
    height: 176,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingTop: 26,
    paddingHorizontal: 16,
    gap: 16,
  },
  clipboardClip: {
    position: 'absolute',
    top: -10,
    alignSelf: 'center',
    width: 52,
    height: 16,
    borderRadius: radius.sm,
    backgroundColor: colors.text,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  checklistLine: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
  },
  trackBadge: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    paddingBottom: 10,
  },
  miniBar: {
    width: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

  // Allergen
  shield: {
    width: 148,
    height: 172,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 72,
    borderBottomRightRadius: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  barcodeBar: {
    height: 66,
    backgroundColor: colors.text,
    borderRadius: 1,
  },
  alertDot: {
    position: 'absolute',
    top: 22,
    right: 46,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertMark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
  magnifier: {
    position: 'absolute',
    right: 30,
    bottom: 30,
  },
  magnifierGlass: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 6,
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  magnifierHandle: {
    position: 'absolute',
    bottom: -12,
    right: -10,
    width: 6,
    height: 22,
    borderRadius: 3,
    backgroundColor: colors.primary,
    transform: [{ rotate: '45deg' }],
  },

  // Insight
  bulb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    marginBottom: -4,
  },
  bulbBase: {
    width: 22,
    height: 12,
    borderRadius: 4,
    backgroundColor: colors.textMuted,
    marginBottom: 24,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    height: 68,
  },
  trendBar: {
    width: 16,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  confidenceBadge: {
    position: 'absolute',
    top: 24,
    right: 30,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
