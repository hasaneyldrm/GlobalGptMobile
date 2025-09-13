module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@/api': './src/api',
          '@/assets': './src/assets',
          '@/components': './src/components',
          '@/config': './src/config',
          '@/constants': './src/constants',
          '@/hooks': './src/hooks',
          '@/navigation': './src/navigation',
          '@/screens': './src/screens',
          '@/store': './src/store',
          '@/theme': './src/theme',
          '@/types': './src/types',
          '@/utils': './src/utils',
        },
      },
    ],
  ],
};
