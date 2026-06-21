import React from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import globalStyles from "@/app/css/styles";
import colors from "@/app/css/colors";
import Button from "@/app/components/Button";

type PopupProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmTitle: string;
  cancelTitle?: string;
  confirmLoading?: boolean;
  confirmLoadingTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function Popup({ visible, title, message, confirmTitle, cancelTitle = "Cancel", confirmLoading = false, confirmLoadingTitle, onClose, onConfirm,
}: PopupProps) {
  return (
    <Modal visible={visible} transparent onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.bottomPopup} onPress={() => {}}>
          <View style={[styles.popupContent, styles.titlePopup]}>
            <Text style={[globalStyles.bannerText, {color: colors.black, textAlign: "left"}]}>
              {title}
            </Text>
          </View>

          <View style={styles.popupContent}>
            <Text style={[globalStyles.bannerText, { textAlign: "left" }]}>
              {message}
            </Text>
          </View>

          <View style={[styles.popupContent, styles.buttonContainerPopup]}>
            <Button title={cancelTitle} variant="stroke" onPress={onClose} />
            <Button
              title={confirmLoading ? confirmLoadingTitle || confirmTitle : confirmTitle}
              variant="fill"
              onPress={onConfirm}
              disabled={confirmLoading}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(21, 21, 21, 0.24)",
  },
  bottomPopup: {},
  popupContent: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderColor: colors.stroke,
  },
  buttonContainerPopup: {
    justifyContent: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingBottom: 35,
  },
  titlePopup: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
