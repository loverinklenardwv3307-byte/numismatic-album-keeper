import type { LucideIcon } from 'lucide-react-native';

/**
 * Single icon library for the whole project: lucide-react-native.
 * SVG, fixed canvas, centered - no raster sprites in buttons or stat cards.
 */
export {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Check,
  ChevronDown,
  Coins,
  Globe,
  Hash,
  House,
  Image as ImageIcon,
  Info,
  Layers,
  Minus,
  Pencil,
  Plus,
  Save,
  Settings as SettingsIcon,
  Trash2,
  TriangleAlert,
} from 'lucide-react-native';

/** Every icon in the app is one of these, at a fixed 22 or 24 dp size. */
export type AppIcon = LucideIcon;
