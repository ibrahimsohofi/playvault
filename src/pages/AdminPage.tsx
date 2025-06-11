import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialShare } from '@/components/shared/SocialShare';
import type { GameResource } from '@/types/games';
import { GAME_RESOURCES } from '@/data/gameData';
import { LazyGameImage } from '@/components/shared/LazyGameImage';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [games, setGames] = useState<GameResource[]>([]);
  const [editingGame, setEditingGame] = useState<GameResource | null>(null);
  const [formData, setFormData] = useState<Partial<GameResource>>({
    id: '',
    title: '',
    category: '',
    description: '',
    image: '',
    logo: '',
    rating: 0,
    unlocks: 0,
    featured: false,
    new: false,
    developer: '',
    publishYear: new Date().getFullYear(),
    version: '1.0.0',
    size: '100MB',
    platforms: [],
    ageRating: '12+',
    features: [],
    requirements: '',
    storeLink: '',
    downloadLink: '',
    screenshots: []
  });
  const [activeTab, setActiveTab] = useState('games');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is already authenticated
    const auth = localStorage.getItem('adminAuth');
    if (auth === 'true') {
      setIsAuthenticated(true);
      loadGames();
    }
  }, []);

  const loadGames = () => {
    // In a real app, this would be an API call
    setGames([...GAME_RESOURCES]);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, verify password on the server
    if (password === 'admin123') { // Replace with secure authentication
      localStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      loadGames();
    } else {
      alert('Incorrect password');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim())
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call
    if (editingGame) {
      // Update existing game
      setGames(games.map(g => g.id === editingGame.id ? { ...formData, id: editingGame.id } as GameResource : g));
    } else {
      // Add new game
      const newGame = {
        ...formData,
        id: formData.title?.toLowerCase().replace(/\s+/g, '-') || '',
      } as GameResource;
      setGames([...games, newGame]);
    }
    resetForm();
  };

  const editGame = (game: GameResource) => {
    setEditingGame(game);
    setFormData({ ...game });
    setActiveTab('edit');
  };

  const deleteGame = (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      setGames(games.filter(g => g.id !== id));
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      category: '',
      description: '',
      image: '',
      logo: '',
      rating: 0,
      unlocks: 0,
      featured: false,
      new: false,
      developer: '',
      publishYear: new Date().getFullYear(),
      version: '1.0.0',
      size: '100MB',
      platforms: [],
      ageRating: '12+',
      features: [],
      requirements: '',
      storeLink: '',
      downloadLink: '',
      screenshots: []
    });
    setEditingGame(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-950 p-4">
        <Card className="w-full max-w-md mx-auto bg-gray-900/90 backdrop-blur-sm shadow-2xl border border-gray-800 rounded-xl overflow-hidden">
          <CardHeader className="space-y-1 pb-2">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-cyan-600 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-white font-orbitron">Admin Portal</h1>
              <p className="text-sm text-gray-400 mt-1">Sign in to access the dashboard</p>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white placeholder-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 font-orbitron tracking-wider"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Sign In
              </Button>
            </form>
            <div className="mt-6 text-center text-sm">
              <p className="text-gray-500">
                For security reasons, please don't share your credentials
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Game Management</h1>
        <Button
          onClick={() => {
            localStorage.removeItem('adminAuth');
            setIsAuthenticated(false);
          }}
          variant="outline"
        >
          Logout
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-900 p-1 rounded-lg border border-gray-800 max-w-lg mx-auto">
          <TabsTrigger
            value="games"
            className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white transition-colors font-orbitron"
          >
            Games
          </TabsTrigger>
          <TabsTrigger
            value="edit"
            className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white transition-colors font-orbitron"
          >
            {editingGame ? 'Edit Game' : 'Add New Game'}
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-white transition-colors font-orbitron"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="games">
          <Card className="bg-gray-900 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-orbitron">Games List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {games.map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-4 border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <LazyGameImage
                        src={game.logo}
                        alt={game.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-medium text-white">{game.title}</h3>
                        <p className="text-sm text-gray-400">{game.category}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editGame(game)}
                        className="text-cyan-400 border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteGame(game.id)}
                        className="bg-red-600/90 hover:bg-red-600"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <Card className="bg-gray-900 border border-gray-800">
            <CardHeader>
              <CardTitle className="text-white font-orbitron">
                {editingGame ? 'Edit Game' : 'Add New Game'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Title</label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Category</label>
                    <Input
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Developer</label>
                    <Input
                      name="developer"
                      value={formData.developer}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Publish Year</label>
                    <Input
                      type="number"
                      name="publishYear"
                      value={formData.publishYear}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Image URL</label>
                    <Input
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Logo URL</label>
                    <Input
                      name="logo"
                      value={formData.logo}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Rating (0-5)</label>
                    <Input
                      type="number"
                      name="rating"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Downloads</label>
                    <Input
                      type="number"
                      name="unlocks"
                      value={formData.unlocks}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Version</label>
                    <Input
                      name="version"
                      value={formData.version}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Size</label>
                    <Input
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Platforms (comma separated)</label>
                    <Input
                      name="platforms"
                      value={formData.platforms?.join(', ')}
                      onChange={handleArrayInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Age Rating</label>
                    <Input
                      name="ageRating"
                      value={formData.ageRating}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured || false}
                        onChange={(e) =>
                          setFormData({ ...formData, featured: e.target.checked })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium">Featured</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="new"
                        checked={formData.new || false}
                        onChange={(e) =>
                          setFormData({ ...formData, new: e.target.checked })
                        }
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium">New Release</span>
                    </label>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-300">Description</label>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-300">Features (one per line)</label>
                    <Textarea
                      name="features"
                      value={formData.features?.join('\n')}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          features: e.target.value.split('\n').filter(Boolean),
                        })
                      }
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-300">System Requirements</label>
                    <Textarea
                      name="requirements"
                      value={formData.requirements}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      rows={4}
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-300">Store Link</label>
                    <Input
                      name="storeLink"
                      type="url"
                      value={formData.storeLink}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-300">Download Link</label>
                    <Input
                      name="downloadLink"
                      type="url"
                      value={formData.downloadLink}
                      onChange={handleInputChange}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      required
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-medium text-gray-300">Screenshots (one URL per line)</label>
                    <Textarea
                      name="screenshots"
                      value={formData.screenshots?.join('\n')}
                      className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          screenshots: e.target.value.split('\n').filter(Boolean),
                        })
                      }
                      rows={4}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setActiveTab('games');
                    }}
                    className="text-gray-300 border-gray-600 hover:bg-gray-800 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-orbitron tracking-wider"
                  >
                    {editingGame ? 'Update Game' : 'Add Game'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            {/* Social Sharing Analytics */}
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-orbitron">Social Sharing & Marketing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Share PlayVault</h3>
                  <p className="text-gray-400 text-sm">
                    Promote PlayVault across social media platforms to increase visibility and downloads.
                  </p>
                  <SocialShare
                    url={typeof window !== "undefined" ? window.location.origin : ""}
                    title="PlayVault - Download Premium Mobile Games Free"
                    description="Discover and download the latest premium mobile games for free. PlayVault offers the best gaming experience with a vast collection of top-rated games."
                    image="/playvault-logo-new.svg"
                    className="flex-wrap"
                  />
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Marketing URLs</h3>
                  <div className="grid gap-3">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Homepage</p>
                      <code className="text-cyan-400 text-sm break-all">
                        {typeof window !== "undefined" ? window.location.origin : ""}
                      </code>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Games Collection</p>
                      <code className="text-cyan-400 text-sm break-all">
                        {typeof window !== "undefined" ? `${window.location.origin}/#games` : ""}
                      </code>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <p className="text-sm text-gray-400 mb-1">Categories</p>
                      <code className="text-cyan-400 text-sm break-all">
                        {typeof window !== "undefined" ? `${window.location.origin}/categories` : ""}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Game Performance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-cyan-400">{games.length}</div>
                      <div className="text-sm text-gray-400">Total Games</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-400">
                        {games.filter(game => game.featured).length}
                      </div>
                      <div className="text-sm text-gray-400">Featured Games</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-orange-400">
                        {games.filter(game => game.new).length}
                      </div>
                      <div className="text-sm text-gray-400">New Releases</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Games for Sharing */}
            <Card className="bg-gray-900 border border-gray-800">
              <CardHeader>
                <CardTitle className="text-white font-orbitron">Top Games for Promotion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {games
                    .filter(game => game.featured || game.rating >= 4.5)
                    .slice(0, 3)
                    .map((game) => (
                      <div key={game.id} className="bg-gray-800 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                          <LazyGameImage
                            src={game.logo || game.image}
                            alt={game.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h4 className="text-white font-semibold">{game.title}</h4>
                            <p className="text-gray-400 text-sm">{game.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-yellow-400">★</span>
                              <span className="text-sm text-gray-300">{game.rating}</span>
                            </div>
                          </div>
                          <SocialShare
                            url={`${typeof window !== "undefined" ? window.location.origin : ""}/games/${game.id}`}
                            title={`${game.title} - Download Free on PlayVault`}
                            description={game.description}
                            compact={true}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
