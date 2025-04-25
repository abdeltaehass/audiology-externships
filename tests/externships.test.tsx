// posts.test.jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PostsPage from '@/app/posts/page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import externshipSurveyData from '@/constants/externshipSurveyData.json';

const mockPush = vi.fn();

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((auth, callback) => {
    callback({ uid: "mock-user-id" });
    return () => {}; 
  }),
  setPersistence: vi.fn().mockResolvedValue(undefined),
  browserLocalPersistence: {},
  signInWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "mock-user-id" } }),
  createUserWithEmailAndPassword: vi.fn().mockResolvedValue({ user: { uid: "mock-user-id" } }),
  signOut: vi.fn().mockResolvedValue({}),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
}));

vi.mock('../src/lib/firebase/config', () => ({
  auth: {},
  db: {},
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn() }),
  push: mockPush,
  refresh: vi.fn(),
  prefetch: vi.fn(),
  usePathname: () => '/posts',
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock('@/components/protectedRoute', () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/components/layout/site-header', async () => {
  const original = await import('@/components/layout/site-header');
  return {
    __esModule: true,
    ...original,
    SiteHeader: () => <header data-testid="SiteHeader">Site Header</header>
  };
});

vi.mock('@/components/posts/posts-list', () => ({
  PostsList: () => {
    return (
      <div data-testid="posts-list">
        {externshipSurveyData.slice(0, 3).map((post) => (
          <div 
            key={post.ID}
            data-testid={`post-${post.ID}`}
            onClick={() => window.history.pushState({}, '', `?post=${post.ID}`)}
          >
            {post["Externship Site Name"]}
          </div>
        ))}
      </div>
    );
  }
}));

vi.mock('@/components/posts/post-details', () => ({
  PostDetails: () => {
    const postId = new URLSearchParams(window.location.search).get('post');
    const post = externshipSurveyData.find(p => p.ID === postId);
    
    return (
      <div data-testid="post-details" className="lg:sticky lg:top-24">
        {post ? (
          <>
            <h3>{post["Externship Site Name"]}</h3>
            <p>{post["City of Externship?"]}, {post["Externship State or Territory?"]}</p>
          </>
        ) : (
          <p>No post selected</p>
        )}
      </div>
    );
  }
}));

vi.mock('@/components/posts/search-input', () => ({
  SearchInput: () => (
    <input 
      data-testid="search-input"
      placeholder="Search externships..."
      onChange={(e) => {
        const url = new URL(window.location.href);
        url.searchParams.set('query', e.target.value);
        window.history.pushState({}, '', url.toString());
      }}
    />
  )
}));

vi.mock('@/components/layout/site-header', () => ({
  SiteHeader: () => <header data-testid="SiteHeader">Site Header</header>
}));


beforeEach(() => {
  vi.clearAllMocks();
});

describe('PostsPage', () => {
  const queryClient = new QueryClient();

  it('renders all main components', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostsPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      // Verify all main components render
      expect(screen.getByTestId('SiteHeader')).toBeInTheDocument();
      expect(screen.getByTestId('posts-list')).toBeInTheDocument();
      expect(screen.getByTestId('post-details')).toBeInTheDocument();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
      expect(screen.getByText('Externship Reviews')).toBeInTheDocument();
    });
  });

  it('shows post details when a post is selected', async () => {
    const testPost = externshipSurveyData[0];
    window.history.pushState({}, '', `/posts?post=${testPost.ID}`);
    
    render(
      <QueryClientProvider client={queryClient}>
        <PostsPage />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('post-details')).toHaveTextContent(testPost["Externship Site Name"]);
      expect(screen.getByTestId('post-details')).toHaveTextContent(testPost["City of Externship?"]);
    });
  });

  it('filters posts when searching', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostsPage />
      </QueryClientProvider>
    );

    const searchTerm = externshipSurveyData[0]["City of Externship?"].split(' ')[0];
    fireEvent.change(screen.getByTestId('search-input'), { 
      target: { value: searchTerm } 
    });

    await waitFor(() => {
      const matchingPosts = externshipSurveyData.filter(post => 
        post["City of Externship?"].includes(searchTerm) ||
        post["Externship Site Name"].includes(searchTerm)
      );
      
      matchingPosts.forEach(post => {
        expect(screen.getByTestId('posts-list')).toHaveTextContent(post["Externship Site Name"]);
      });
    });
  })

  it('navigates to the correct post when clicked', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostsPage />
      </QueryClientProvider>
    );

    const testPost = externshipSurveyData[0];
    fireEvent.click(screen.getByTestId(`post-${testPost.ID}`));

    await waitFor(() => {
      expect(window.location.search).toContain(`post=${testPost.ID}`);
    });
  });

  it('handles empty search input', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <PostsPage />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByTestId('search-input'), { target: { value: '' } });

    await waitFor(() => {
      const posts = screen.getAllByTestId(/^post-EXS_\d+$/);
      expect(posts.length).toBeGreaterThan(0); 
    });
  });
});