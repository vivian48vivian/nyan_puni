Git運用マニュアル
開発の流れ
	1	ChatGPTで仕様・方針を決める
	2	CODEXで実装する
	3	動作確認・プレイテスト
	4	問題なければGitへ保存
	5	GitHubへバックアップ

ターミナルで行うこと
状態確認
git status
保存
git add .
git commit -m "変更内容"
git push

コミットメッセージ
	•	Add：新機能
	•	Fix：バグ修正
	•	Improve：改善
	•	Balance：ゲームバランス調整
	•	Refactor：内部整理
例
Add title screen
Fix pause and exit flow
Improve UI layout
Balance stage progression

保存ルール
	•	機能が完成したタイミングでコミット
	•	動作確認後にコミット
	•	バグがある状態ではコミットしない
	•	コミット後は必ず git push

プロジェクト運用
	•	機能ごとにChatGPT Project内でチャットを分ける
	•	GitHubは常に最新状態を維持する
	•	docs/ に仕様・メモ・TODOを保存する

正常な状態
git status
結果が
nothing to commit, working tree clean
なら保存完了。
