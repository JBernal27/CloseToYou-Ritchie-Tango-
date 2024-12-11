import React, {useEffect, useRef} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated, // Importar Animated para la animación
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GlobalContext} from '../global.context';

const stylesByType = {
  error: {
    container: {
      backgroundColor: '#f8d7da',
      borderColor: '#f5c6cb',
    },
    text: {
      color: '#721c24',
    },
    actionText: {
      color: '#f5c6cb',
    },
    iconName: 'error-outline',
  },
  warning: {
    container: {
      backgroundColor: '#fff3cd',
      borderColor: '#ffeeba',
    },
    text: {
      color: '#856404',
    },
    actionText: {
      color: '#ffeeba',
    },
    iconName: 'warning-amber',
  },
  info: {
    container: {
      backgroundColor: '#d1ecf1',
      borderColor: '#bee5eb',
    },
    text: {
      color: '#0c5460',
    },
    actionText: {
      color: '#bee5eb',
    },
    iconName: 'info-outline',
  },
  success: {
    container: {
      backgroundColor: '#d4edda',
      borderColor: '#c3e6cb',
    },
    text: {
      color: '#155724',
    },
    actionText: {
      color: '#c3e6cb',
    },
    iconName: 'check-circle-outline',
  },
};

const Snackbar = () => {
  const context = React.useContext(GlobalContext!);

  const {
    message,
    actionText,
    onActionPress,
    duration,
    position,
    type,
    isVisible,
  } = context?.snackbarInfo!;

  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    if (isVisible) {
      const timeout = setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start();
        // context?.setSnackbarInfo({...context?.snackbarInfo, isVisible: false});
      }, duration ? duration : 3500);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, duration, context, slideAnim]);

  const currentStyle = stylesByType[type] || stylesByType.info;
  const iconName = currentStyle.iconName;

  return isVisible ? (
    <Animated.View
      style={[
        styles.container,
        position === 'bottom' ? styles.bottomContainer : styles.topContainer,
        currentStyle.container,
        {transform: [{translateY: slideAnim}]},
      ]}>
      <MaterialIcons
        name={iconName}
        size={24}
        style={[styles.icon, currentStyle.text]}
      />
      <Text style={[styles.messageText, currentStyle.text]}>{message}</Text>
      {actionText && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={[styles.actionText, currentStyle.actionText]}>
            {actionText}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 4,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    left: 15,
    right: 15,
  },
  topContainer: {
    top: 15,
  },
  bottomContainer: {
    bottom: 15,
  },
  messageText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 14,
  },
  icon: {
    marginRight: 8,
  },
});

export default Snackbar;
