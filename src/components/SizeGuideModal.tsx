"use client";
import { motion, AnimatePresence } from "framer-motion";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SizeGuideModal = ({ isOpen, onClose }: SizeGuideModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-md w-[90%] max-w-3xl p-6 shadow-lg relative"
            initial={{ y: -50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-2">Size Guide</h2>
            <p className="text-sm text-gray-600 mb-4">
              Our clothing is all diverse. Please refer to the Size guide below.
              Our sizes may slightly vary due to the nature of fabrications.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-t">
                <thead className="text-left border-b">
                  <tr className="text-gray-600 text-center">
                    <th className="py-2">AU/NZ & UK</th>
                    <th>US</th>
                    <th>BUST</th>
                    <th>WAIST</th>
                    <th>HIPS</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["6/XS", "2", "82", "63", "89"],
                    ["8/S", "4", "85", "66", "92"],
                    ["10/M", "6", "90", "71", "97"],
                    ["12/L", "8", "95", "76", "102"],
                    ["14/XL", "10", "100", "81", "107"],
                    ["16/XXL", "12", "105", "86", "112"],
                  ].map(([au, us, bust, waist, hips], idx) => (
                    <tr key={idx} className="border-b">
                      <td className="py-2">{au}</td>
                      <td>{us}</td>
                      <td>{bust} cm</td>
                      <td>{waist} cm</td>
                      <td>{hips} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SizeGuideModal;
