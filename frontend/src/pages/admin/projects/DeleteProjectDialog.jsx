 import { motion, AnimatePresence } from "framer-motion"

export default function DeleteProjectDialog({ open, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="bg-[#111] border border-white/10 p-6 rounded-2xl w-[400px] space-y-4"
          >
            <h3 className="text-lg font-semibold">Delete Project</h3>
            <p className="text-gray-400 text-sm">
              Are you sure you want to permanently delete this project?
            </p>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white/5"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}