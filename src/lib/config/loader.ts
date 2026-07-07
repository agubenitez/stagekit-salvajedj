import fs from 'fs';
import path from 'path';
import { LandingConfigSchema, type LandingConfig } from './schema';
import { DESIGN_PRESETS } from '@/features/theme/designPresets';

export function getLandingConfig(): LandingConfig {
  try {
    const configPath = path.join(process.cwd(), 'config', 'landingdj.config.json');

    if (!fs.existsSync(configPath)) {
      throw new Error(`Archivo de configuración no encontrado en la ruta esperada: ${configPath}`);
    }

    const fileContents = fs.readFileSync(configPath, 'utf8');
    const rawData = JSON.parse(fileContents);
    const validationResult = LandingConfigSchema.safeParse(rawData);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.errors
        .map((err) => `[Campo: ${err.path.join('.')}] - ${err.message}`)
        .join('\n');

      console.error('❌ Error de Validación en landingdj.config.json:\n', formattedErrors);
      throw new Error(`La configuración de la landing es inválida:\n${formattedErrors}`);
    }

    const config = validationResult.data;
    const preset = DESIGN_PRESETS[config.designPreset];

    if (!preset) {
      throw new Error(`Design preset "${config.designPreset}" no encontrado. Presets disponibles: ${Object.keys(DESIGN_PRESETS).join(', ')}`);
    }

    return {
      ...config,
      colors: preset.colors,
      typography: preset.typography,
      tokens: preset.tokens,
    };
  } catch (error: any) {
    console.error('🚨 Error crítico en el cargador de configuración:', error.message);
    throw error;
  }
}
