import AdminLayout from './AdminLayout';
import { useBooks } from '@/hooks/useBooks';
import { useCategories } from '@/hooks/useCategories';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { BookOpen, FolderOpen, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data: books = [] } = useBooks();
  const { data: categories = [] } = useCategories();
  const { data: teamMembers = [] } = useTeamMembers();

  const stats = [
    {
      label: 'Total Books',
      value: books.length,
      icon: BookOpen,
      href: '/admin/books',
      color: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: FolderOpen,
      href: '/admin/categories',
      color: 'from-purple-500/20 to-pink-500/20',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Team Members',
      value: teamMembers.length,
      icon: Users,
      href: '/admin/team',
      color: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-600',
    },
  ];

  const recentBooks = books.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's an overview of your content.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.href}
              className="glass-card p-6 hover-lift group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-display text-4xl font-bold text-foreground mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} 
                              flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-7 h-7 ${stat.iconColor}`} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Books */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-foreground">Recent Books</h2>
            <Link
              to="/admin/books"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>

          {recentBooks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No books yet. Add your first book!</p>
              <Link
                to="/admin/books"
                className="text-sm text-primary hover:underline mt-2 inline-block"
              >
                Add Book
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Author</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBooks.map((book) => (
                    <tr key={book.id} className="border-b border-border/50 hover:bg-secondary/50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {book.cover_image ? (
                            <img
                              src={book.cover_image}
                              alt={book.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                          ) : (
                            <div className="w-10 h-14 bg-muted rounded flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-muted-foreground" />
                            </div>
                          )}
                          <span className="font-medium text-foreground">{book.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{book.author}</td>
                      <td className="py-4 px-4">
                        {book.category ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {book.category.name}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {new Date(book.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
