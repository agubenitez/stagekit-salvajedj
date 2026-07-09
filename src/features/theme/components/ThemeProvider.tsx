import React from 'react';
import { type ColorsConfig, type TypographyConfig } from '@/lib/config/schema';
import { hexToRgba, type DesignTokens } from '../designPresets';

interface ThemeProviderProps {
  colors: ColorsConfig;
  typography: TypographyConfig;
  tokens: DesignTokens;
  sectionMaxWidth?: string;
  children: React.ReactNode;
}

export default function ThemeProvider({ colors, typography, tokens, sectionMaxWidth, children }: ThemeProviderProps) {
  const themeStyles: Record<string, string> = {
    '--theme-primary': colors.primary,
    '--theme-secondary': colors.secondary,
    '--theme-accent': colors.accent,
    '--theme-background-custom': colors.background,
    '--theme-text-custom': colors.text,
    '--theme-text-muted': tokens.textMuted,
    '--theme-font-heading': `"${typography.heading}", "Space Grotesk", sans-serif`,
    '--theme-font-body': `"${typography.body}", "Inter", sans-serif`,
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-accent': colors.accent,
    '--color-background-custom': colors.background,
    '--color-text-custom': colors.text,
    '--color-text-muted': tokens.textMuted,
    '--font-heading': `"${typography.heading}", "Space Grotesk", sans-serif`,
    '--font-body': `"${typography.body}", "Inter", sans-serif`,
    '--btn-primary-bg': tokens.btnPrimaryBgAlpha !== undefined ? hexToRgba(tokens.btnPrimaryBg, tokens.btnPrimaryBgAlpha) : tokens.btnPrimaryBg,
    '--btn-primary-text': tokens.btnPrimaryText,
    '--btn-primary-radius': tokens.btnPrimaryRadius,
    '--btn-primary-shadow': tokens.btnPrimaryShadow,
    '--btn-primary-hover-bg': tokens.btnPrimaryHoverBg,
    '--btn-primary-hover-shadow': tokens.btnPrimaryHoverShadow,
    '--btn-primary-hover-scale': tokens.btnPrimaryHoverScale,
    '--btn-secondary-bg': tokens.btnSecondaryBg,
    '--btn-secondary-text': tokens.btnSecondaryText,
    '--btn-secondary-hover-bg': tokens.btnSecondaryHoverBg,
    '--card-bg': tokens.cardBg,
    '--card-bg-hover': tokens.cardBgHover,
    '--card-bg-raised': tokens.cardBgRaised,
    '--card-border': tokens.cardBorder,
    '--card-border-hover': tokens.cardBorderHover,
    '--card-radius': tokens.cardRadius,
    '--card-shadow': tokens.cardShadow,
    '--card-hover-transform': tokens.cardHoverTransform,
    '--card-hover-shadow': tokens.cardHoverShadow,
    '--card-left-border': tokens.cardLeftBorder,
    '--section-bg': tokens.sectionBg,
    '--section-bg-mid': tokens.sectionBgMid,
    '--section-bg-alt': tokens.sectionBgAlt,
    '--heading-color': tokens.headingColor,
    '--text-label': tokens.textLabelColor,
    '--text-secondary': tokens.textSecondaryColor,
    '--overlay': tokens.overlayColor,
    '--overlay-mid': tokens.overlayMidColor,
    '--overlay-strong': tokens.overlayStrongColor,
    '--overlay-faint': tokens.overlayFaintColor,
    '--navbar-shadow': tokens.navbarShadowColor,
    '--success': tokens.successColor,
    '--error': tokens.errorColor,
    '--hero-bg': tokens.heroBg,
    '--hero-title-size-1': tokens.heroTitleSizeTop,
    '--hero-title-size-2': tokens.heroTitleSizeMiddle,
    '--hero-title-size-3': tokens.heroTitleSizeBottom,
    '--hero-title-opacity-1': tokens.heroTitleOpacityTop,
    '--hero-title-opacity-2': tokens.heroTitleOpacityMiddle,
    '--hero-title-opacity-3': tokens.heroTitleOpacityBottom,
    '--hero-title-text-shadow-1': tokens.heroTitleTextShadowTop,
    '--hero-title-text-shadow-2': tokens.heroTitleTextShadowMiddle,
    '--hero-title-text-shadow-3': tokens.heroTitleTextShadowBottom,
    '--hero-title-size-4': tokens.heroTitleSizeFourth,
    '--hero-title-opacity-4': tokens.heroTitleOpacityFourth,
    '--hero-title-text-shadow-4': tokens.heroTitleTextShadowFourth,
    '--hero-title-drift': tokens.heroTitleDrift,
    '--bio-con-foto-order-image': tokens.bioConFotoLayout === 'image-right' ? '2' : '1',
    '--bio-con-foto-order-text': tokens.bioConFotoLayout === 'image-right' ? '1' : '2',
    '--font-weight-heading': tokens.fontWeightHeading,
    '--letter-spacing-tag': tokens.letterSpacingTag,
    '--letter-spacing-cta': tokens.letterSpacingCta,
    '--section-padding-y': tokens.sectionPaddingY,
    '--section-header-gap': tokens.sectionHeaderGap,
    '--navbar-blur': tokens.navbarBlur,
    '--input-bg': tokens.inputBg,
    '--input-border': tokens.inputBorder,
    '--input-radius': tokens.inputRadius,
    '--input-text': tokens.inputText,
    '--input-placeholder': tokens.inputPlaceholder,
    '--input-focus-border': tokens.inputFocusBorder,
    '--input-focus-ring': tokens.inputFocusRing,
    '--badge-bg': tokens.badgeBg,
    '--badge-text': tokens.badgeText,
    '--badge-border': tokens.badgeBorder,
    '--badge-radius': tokens.badgeRadius,
    '--navbar-bg': tokens.navbarBg,
    '--navbar-border': tokens.navbarBorder,
    '--navbar-text': tokens.navbarText,
    '--navbar-hover-text': tokens.navbarHoverText,
    '--selection-bg': tokens.selectionBg,
    '--selection-text': tokens.selectionText,
    '--section-max-width': sectionMaxWidth ?? '1152px',
  };

  return (
    <div
      style={themeStyles as React.CSSProperties}
      className="min-h-screen flex flex-col bg-[var(--theme-background-custom)] text-[var(--theme-text-custom)] font-body"
    >
      {children}
    </div>
  );
}
