// Generate consistent color gradient from string
export const getInitialsColor = (str) => {
  const colors = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-red-500 to-pink-500',
    'from-violet-500 to-purple-500',
    'from-fuchsia-500 to-pink-500',
    'from-cyan-500 to-blue-500',
    'from-lime-500 to-green-500',
  ];
  
  if (!str) return colors[0];
  
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

// Get user initials from name
export const getUserInitials = (user) => {
  if (user?.firstName && user?.lastName) {
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }
  if (user?.username) {
    return user.username.substring(0, 2).toUpperCase();
  }
  return 'U';
};
