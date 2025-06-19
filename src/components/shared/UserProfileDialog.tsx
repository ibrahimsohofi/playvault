import type React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User,
  Calendar,
  Download,
  Settings,
  Bell,
  Palette,
  Save,
  X,
  GamepadIcon,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { GAME_RESOURCES } from '@/data/games';

interface UserProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileDialog: React.FC<UserProfileDialogProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, downloadHistory, logout } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    username: user?.username || '',
    email: user?.email || ''
  });

  if (!user) return null;

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      displayName: user.displayName,
      username: user.username,
      email: user.email
    });
    setIsEditing(false);
  };

  const getGameById = (gameId: string) => {
    return GAME_RESOURCES.find(game => game.id === gameId);
  };

  const recentDownloads = downloadHistory.slice(0, 5);
  const totalDownloads = downloadHistory.length;
  const favoriteCategories = user.preferences.favoriteCategories;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-auto">
            <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 py-2">Profile</TabsTrigger>
            <TabsTrigger value="downloads" className="text-xs sm:text-sm px-2 py-2">Downloads</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm px-2 py-2">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-sm sm:text-lg">Profile Information</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs sm:text-sm"
                  >
                    {isEditing ? <X className="h-3 w-3 sm:h-4 sm:w-4" /> : <Settings className="h-3 w-3 sm:h-4 sm:w-4" />}
                    <span className="hidden sm:inline">{isEditing ? 'Cancel' : 'Edit'}</span>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                    <AvatarImage src={user.avatar} alt={user.displayName} />
                    <AvatarFallback>
                      {user.displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold truncate">{user.displayName}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base truncate">@{user.username}</p>
                    <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="truncate">Joined {new Date(user.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input
                          id="displayName"
                          value={formData.displayName}
                          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button onClick={handleSave} className="w-full sm:w-auto">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm break-all">{user.email}</p>
                    </div>
                    <div>
                      <Label>Username</Label>
                      <p className="text-sm break-all">@{user.username}</p>
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-primary">{totalDownloads}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Downloads</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-primary">{favoriteCategories.length}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Favorite Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg sm:text-2xl font-bold text-primary">
                      {Math.floor((Date.now() - new Date(user.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Days Active</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="downloads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                  <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                  Download History ({totalDownloads})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {downloadHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <GamepadIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No downloads yet</p>
                    <p className="text-sm text-muted-foreground">Start exploring games to build your library!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {downloadHistory.map((download) => {
                      const game = getGameById(download.gameId);
                      if (!game) return null;

                      return (
                        <div key={download.id} className="flex items-center gap-2 sm:gap-4 p-3 sm:p-4 border rounded-lg">
                          <img
                            src={game.image}
                            alt={game.title}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm sm:text-base truncate">{game.title}</h4>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{new Date(download.downloadDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                <span className="truncate">Version {download.version}</span>
                              </div>
                            </div>
                          </div>
                          <Badge variant={download.completed ? "default" : "secondary"} className="text-xs flex-shrink-0">
                            {download.completed ? "Completed" : "Pending"}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm sm:text-lg">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  Account Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <Label className="text-sm sm:text-base">Notifications</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Receive notifications about new games and updates
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                      <Bell className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      {user.preferences.notifications ? 'Enabled' : 'Disabled'}
                    </Button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <Label className="text-sm sm:text-base">Theme</Label>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Choose your preferred color theme
                      </p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                      <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      {user.preferences.theme}
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Label className="text-sm sm:text-base">Favorite Categories</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      Categories you're most interested in
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {favoriteCategories.length > 0 ? (
                        favoriteCategories.map((category) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          No favorite categories set
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 sm:pt-6 border-t">
                  <Button
                    variant="destructive"
                    onClick={logout}
                    className="w-full text-sm sm:text-base"
                  >
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileDialog;
