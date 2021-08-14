import * as React from 'react';
import { Modal } from '@supabase/ui';
import { render, unmountComponentAtNode } from 'react-dom';

type ConfirmModalProps = {
  title: string;
  message: string;
  onConfirm?: () => void;
  onAsyncConfirm?: () => Promise<void>;
  variant?: 'danger' | 'warning' | 'success' | undefined;
};
const ConfirmModal: React.FC<ConfirmModalProps> = ({
  title,
  message,
  onConfirm,
  onAsyncConfirm,
  variant = 'danger',
}) => {
  const [loading, setLoading] = React.useState(false);

  function onCancelClick() {
    if (!loading) onClose();
  }

  async function onConfirmClick() {
    if (onAsyncConfirm) {
      setLoading(true);
      await onAsyncConfirm();

      onClose();
    } else if (onConfirm) {
      onConfirm();
      onClose();
    }
  }

  function onClose() {
    removeElement();
  }

  return (
    <Modal
      variant={variant}
      visible={true}
      title={title}
      description={message}
      showIcon={false}
      size="small"
      confirmText="OK"
      cancelText="Cancel"
      onCancel={onCancelClick}
      onConfirm={onConfirmClick}
      loading={loading}
    />
  );
};

function removeElement() {
  const target = document.getElementById('supabase-ui-confirm-alert');
  if (target) {
    unmountComponentAtNode(target);
    target?.parentNode?.removeChild(target);
  }
}

function createElement(props: ConfirmModalProps) {
  let divTarget = document.getElementById('supabase-ui-confirm-alert');
  if (divTarget) {
    render(<ConfirmModal {...props} />, divTarget);
  } else {
    divTarget = document.createElement('div');
    divTarget.id = 'supabase-ui-confirm-alert';
    document.body.appendChild(divTarget);
    render(<ConfirmModal {...props} />, divTarget);
  }
}

export function showConfirmAlert(props: ConfirmModalProps) {
  createElement(props);
}
