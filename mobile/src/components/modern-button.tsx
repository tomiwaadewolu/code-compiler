import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
  TextStyle,
  PressableProps,
  Animated,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface ModernButtonProps extends PressableProps {
  title: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
}

const getVariantStyles = (variant: Variant, theme: any) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: theme.accent,
        textColor: '#FFFFFF',
      };
    case 'secondary':
      return {
        backgroundColor: theme.backgroundElement,
        textColor: theme.text,
      };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        textColor: theme.accent,
        borderColor: theme.accent,
        borderWidth: 1.5,
      };
    case 'ghost':
      return {
        backgroundColor: 'transparent',
        textColor: theme.text,
      };
    default:
      return {
        backgroundColor: theme.accent,
        textColor: '#FFFFFF',
      };
  }
};

const getSizeStyles = (size: Size) => {
  switch (size) {
    case 'sm':
      return {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        fontSize: FontSize.sm,
      };
    case 'md':
      return {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        fontSize: FontSize.base,
      };
    case 'lg':
      return {
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        fontSize: FontSize.md,
      };
    default:
      return {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        fontSize: FontSize.base,
      };
  }
};

export function ModernButton({
  title,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  disabled = false,
  onPress,
  ...props
}: ModernButtonProps) {
  const theme = useTheme();
  const variantStyles = getVariantStyles(variant, theme);
  const sizeStyles = getSizeStyles(size);

  const containerStyle: ViewStyle[] = [
    styles.button,
    {
      backgroundColor: disabled ? theme.backgroundElement : variantStyles.backgroundColor,
      borderColor: variantStyles.borderColor || 'transparent',
      borderWidth: variantStyles.borderWidth || 0,
      ...(fullWidth && { width: '100%' }),
      ...Shadow.md,
    },
  ];

  const textStyle: TextStyle = {
    color: disabled ? theme.textSecondary : variantStyles.textColor,
    fontSize: sizeStyles.fontSize,
    fontWeight: FontWeight.semibold,
  };

  return (
    <Pressable
      style={({ pressed }) => [
        containerStyle,
        pressed && !disabled && {
          opacity: 0.85,
          ...Shadow.sm,
        },
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      {...props}>
      <Text style={textStyle}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
