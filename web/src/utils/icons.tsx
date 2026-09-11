import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
  style?: any;
}

const createIcon = (symbol: string) => {
  return function IconWrapper({ size = 18, color = 'currentColor', className, style }: IconProps) {
    const iconColor = color === 'currentColor' ? '#4f46e5' : color;
    return (
      <span
        className={className || ''}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          fontSize: Math.max(12, Number(size) - 2),
          color: iconColor,
          lineHeight: 1,
          fontWeight: 'bold',
          userSelect: 'none',
          ...style,
        }}
      >
        {symbol}
      </span>
    );
  };
};

export const User = createIcon('👤');
export const Users = createIcon('👥');
export const Phone = createIcon('📞');
export const Mail = createIcon('✉️');
export const MapPin = createIcon('📍');
export const Heart = createIcon('❤️');
export const Share2 = createIcon('🔗');
export const Download = createIcon('📥');
export const Search = createIcon('🔍');
export const BarChart = createIcon('📊');
export const BarChart3 = createIcon('📊');
export const BarChart2 = createIcon('📈');
export const PieChart = createIcon('🥧');
export const Filter = createIcon('🔍');
export const FileSpreadsheet = createIcon('📄');
export const CheckCircle2 = createIcon('✅');
export const CheckCircle = createIcon('✅');
export const CheckSquare = createIcon('☑️');
export const XCircle = createIcon('❌');
export const FileText = createIcon('📝');
export const IndianRupee = createIcon('₹');
export const CreditCard = createIcon('💳');
export const Calendar = createIcon('📅');
export const DollarSign = createIcon('💵');
export const Wallet = createIcon('👛');
export const Tag = createIcon('🏷️');
export const Layers = createIcon('📑');
export const Hash = createIcon('#');
export const Edit3 = createIcon('✏️');
export const MoreHorizontal = createIcon('•••');
export const Inbox = createIcon('📥');
export const SlidersHorizontal = createIcon('⚙️');
export const Plus = createIcon('＋');
export const PlusCircle = createIcon('➕');
export const Eye = createIcon('👁️');
export const EyeOff = createIcon('🙈');
export const MessageCircle = createIcon('💬');
export const Printer = createIcon('🖨️');
export const ChevronDown = createIcon('▾');
export const Loader2 = createIcon('⏳');
export const Check = createIcon('✓');
export const Paperclip = createIcon('📎');
export const X = createIcon('✕');
export const AlertTriangle = createIcon('⚠️');
export const QrCode = createIcon('📷');
export const Camera = createIcon('📷');
export const SwitchCamera = createIcon('🔄');
export const Upload = createIcon('📤');
export const Flashlight = createIcon('🔦');
export const ArrowLeft = createIcon('←');
export const ArrowRight = createIcon('→');
export const ArrowUpRight = createIcon('↗');
export const ArrowDownLeft = createIcon('↙');
export const Bell = createIcon('🔔');
export const LayoutDashboard = createIcon('📊');
export const Building2 = createIcon('🏢');
export const LogOut = createIcon('🚪');
export const Lock = createIcon('🔒');
export const UserPlus = createIcon('👤+');
export const ShieldCheck = createIcon('🛡️');
export const UserCheck = createIcon('👤✓');
export const Power = createIcon('⏻');
export const History = createIcon('📜');
export const Clock = createIcon('🕒');
export const ShieldAlert = createIcon('🛡️!');
export const Receipt = createIcon('🧾');
export const TrendingUp = createIcon('📈');
export const TrendingDown = createIcon('📉');
export const Globe = createIcon('🌐');
export const Settings = createIcon('⚙️');
export const Info = createIcon('ℹ️');
export const Monitor = createIcon('🖥️');
export const Smartphone = createIcon('📱');
export const Menu = createIcon('☰');
export const ChevronRight = createIcon('▸');
export const Image = createIcon('🖼️');
export const Trash2 = createIcon('🗑️');
export const Sparkles = createIcon('✨');
export const Type = createIcon('🔤');
