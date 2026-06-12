import type { Product } from "../types";
import Modal from "./Modal";
import ProductForm from "./ProductForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
};

const ProductModal = ({
  isOpen,
  onClose,
  product,
}: Props) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ProductForm
        product={product}
        onSuccess={onClose}
      />
    </Modal>
  );
};

export default ProductModal;