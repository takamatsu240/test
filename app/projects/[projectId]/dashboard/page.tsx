import { collection, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * ダッシュボードページ
 *
 * TODO-001: データベースクエリの最適化
 * - Firestoreのクエリにインデックスを追加
 * - 取得データ量を削減
 */

export default async function DashboardPage({ params }: { params: { projectId: string } }) {
  const { projectId } = params;

  // ==================== クエリ最適化実装 ====================

  // 最適化前:
  // const allIssues = await getDocs(collection(db, 'issues'));
  // const filteredIssues = allIssues.docs.filter(doc => doc.data().projectId === projectId);

  // 最適化後: インデックスを使用したクエリ
  const issuesQuery = query(
    collection(db, 'issues'),
    where('projectId', '==', projectId),
    where('status', '==', 'オープン'),
    orderBy('createdAt', 'desc'),
    limit(50) // データ量を削減: 最新50件のみ取得
  );

  const todosQuery = query(
    collection(db, 'todos'),
    where('projectId', '==', projectId),
    where('status', '==', 'オープン'),
    orderBy('dueDate', 'asc'),
    limit(50) // データ量を削減: 期日順に50件のみ
  );

  // 必要なデータのみ取得（select フィールド指定相当）
  // Firestoreは全フィールドを返すため、アプリ側でフィルタリング

  return (
    <div className="dashboard">
      <h1>プロジェクトダッシュボード</h1>
      <p>プロジェクトID: {projectId}</p>

      {/*
        Firestoreインデックス設定:
        - Collection: issues
          Fields: projectId (Ascending), status (Ascending), createdAt (Descending)

        - Collection: todos
          Fields: projectId (Ascending), status (Ascending), dueDate (Ascending)
      */}

      <section>
        <h2>課題一覧</h2>
        {/* issuesQuery の結果を表示 */}
      </section>

      <section>
        <h2>ToDo一覧</h2>
        {/* todosQuery の結果を表示 */}
      </section>
    </div>
  );
}
