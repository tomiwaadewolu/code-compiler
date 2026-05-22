import React, { useState, useRef } from 'react';
import {
  View,
  Pressable,
  StyleSheet,
  Text,
  Modal,
  FlatList,
  ViewStyle,
  LayoutRectangle,
  useWindowDimensions,
} from 'react-native';
import { useTheme } from '@/hooks/use-theme';
import { BorderRadius, FontSize, FontWeight, Shadow, Spacing } from '@/constants/theme';

interface DropdownOption {
  label: string;
  value: string;
}

interface ModernDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  style?: ViewStyle;
}

export function ModernDropdown({
  options,
  value,
  onChange,
  label,
  style,
}: ModernDropdownProps) {
  const theme = useTheme();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const [visible, setVisible] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState<LayoutRectangle | null>(null);
  const selectedOption = options.find(opt => opt.value === value);

  const handleTriggerLayout = (event: any) => {
    setTriggerLayout(event.nativeEvent.layout);
  };

  // Calculate dropdown position
  const menuHeight = Math.min(options.length * 50 + 20, 250); // ~50px per item, max 250px
  const availableSpaceBelow = triggerLayout
    ? screenHeight - (triggerLayout.y + triggerLayout.height + Spacing.lg)
    : 0;

  const shouldShowBelow = availableSpaceBelow > menuHeight;
  const menuTop = triggerLayout
    ? shouldShowBelow
      ? triggerLayout.y + triggerLayout.height + Spacing.sm
      : Math.max(Spacing.lg, triggerLayout.y - menuHeight - Spacing.sm)
    : 0;

  return (
    <View style={style}>
      {label && (
        <Text style={[styles.label, { color: theme.textSecondary }]}>
          {label}
        </Text>
      )}
      <Pressable
        onLayout={handleTriggerLayout}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: visible ? theme.accent : theme.border,
            borderWidth: 1.5,
          },
          pressed && { opacity: 0.8 },
        ]}
        onPress={() => setVisible(true)}>
        <Text style={[styles.triggerText, { color: theme.text }]}>
          {selectedOption?.label || 'Select...'}
        </Text>
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisible(false)}>
          <View
            style={[
              styles.menu,
              {
                backgroundColor: theme.backgroundElement,
                borderColor: theme.border,
                top: menuTop,
                maxHeight: menuHeight,
              },
              Shadow.lg,
            ]}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              scrollEnabled
              renderItem={({ item, index }) => (
                <>
                  <Pressable
                    style={({ pressed }) => [
                      styles.menuItem,
                      {
                        backgroundColor:
                          item.value === value ? theme.backgroundSelected : 'transparent',
                      },
                      pressed && { opacity: 0.7 },
                    ]}
                    onPress={() => {
                      onChange(item.value);
                      setVisible(false);
                    }}>
                    <Text
                      style={[
                        styles.menuItemText,
                        {
                          color:
                            item.value === value ? theme.accent : theme.text,
                          fontWeight:
                            item.value === value ? FontWeight.semibold : FontWeight.normal,
                        },
                      ]}>
                      {item.label}
                    </Text>
                  </Pressable>
                  {index < options.length - 1 && (
                    <View style={[styles.divider, { borderColor: theme.border }]} />
                  )}
                </>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  trigger: {
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
  },
  triggerText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    position: 'absolute',
    left: Spacing.lg,
    right: Spacing.lg,
    borderRadius: BorderRadius.lg,
    minWidth: 200,
  },
  menuItem: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  menuItemText: {
    fontSize: FontSize.base,
  },
  divider: {
    height: 1,
    borderTopWidth: 1,
  },
});
