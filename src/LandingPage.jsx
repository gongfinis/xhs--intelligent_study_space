import React from 'react';

export default function LandingPage() {
  const scrollToDemo = () => {
    window.location.hash = '#/demo';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 导航栏 */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">书</span>
              </div>
              <span className="font-semibold text-gray-900">智能学习空间</span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition">核心能力</a>
              <a href="#scenarios" className="text-gray-600 hover:text-gray-900 transition">交互场景</a>
              <a href="#tech" className="text-gray-600 hover:text-gray-900 transition">技术实现</a>
              <button
                onClick={scrollToDemo}
                className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition font-medium"
              >
                立即体验
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero 区域 */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                打破收藏即吃灰；<br />
                小红书「<span className="text-red-500">智能学习空间</span>」<br />
                demo来了
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                基于AI的智能分类与主动推送系统，让你的收藏不再沉睡。<br />
                自动整理、智能推荐、个性化学习路径。
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={scrollToDemo}
                  className="bg-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  启动交互原型
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold hover:border-gray-400 transition">
                  了解更多
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-3xl p-8 shadow-2xl">
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="./covers/1-figma.jpg"
                    alt="App Preview"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 核心痛点 */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-red-500 font-semibold text-sm uppercase tracking-wider">Pain Points</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-3 mb-4">
              核心痛点：信息过载下的「收藏即吃灰」
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              在小红书等平台上，我们不断收藏有价值的内容，但缺乏有效的管理和回顾机制，
              导致大量优质内容被遗忘。传统收藏夹无法满足个性化学习和知识管理需求。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-100">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">海量内容难管理</h3>
              <p className="text-gray-600 leading-relaxed">
                收藏的内容堆积如山，缺乏有效的分类和检索机制，
                找到需要的内容如同大海捞针。
              </p>
            </div>

            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">💭</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">被动遗忘严重</h3>
              <p className="text-gray-600 leading-relaxed">
                没有主动提醒和复习机制，收藏后便束之高阁，
                知识转化率极低。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 智能分类与主动触达 */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              智能分类与主动触达空间
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl">
              通过AI技术自动分析内容主题，构建个性化知识图谱，
              实现智能分类、定时推送和学习进度追踪。
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  01
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">AI智能分类</h3>
                  <p className="text-gray-600 leading-relaxed">
                    基于自然语言处理和机器学习算法，自动识别内容主题、类型和价值等级，
                    将杂乱的收藏内容有序归类到不同学习领域。
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 text-2xl font-bold">
                  02
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">主动推送提醒</h3>
                  <p className="text-gray-600 leading-relaxed">
                    根据艾宾浩斯遗忘曲线和用户学习习惯，智能安排复习时间，
                    通过多渠道推送确保重要内容不被遗忘。
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <img
                  src="./covers/2-ai-design.png"
                  alt="AI Classification"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 三大核心交互场景 */}
      <section id="scenarios" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              三大核心交互场景
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              覆盖收藏管理的全生命周期，从收集到学习再到应用
            </p>
          </div>

          {/* 场景1 */}
          <div className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="text-red-500 font-semibold text-sm">Scenario 01</span>
                <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">核心流式对话</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  通过自然语言交互，用户可以用口语化方式描述需求，
                  AI助手实时理解意图并提供精准响应。
                  支持多轮对话上下文理解，让操作更自然流畅。
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>支持中英文混合输入</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>实时语义分析和意图识别</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>上下文记忆与多轮对话</span>
                  </li>
                </ul>
              </div>

              <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden">
                  <img src="./covers/3-xieyinmeng.jpg" alt="Chat UI" className="w-full h-auto rounded-xl" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden mt-8">
                  <img src="./covers/4-macbook.jpg" alt="Chat Interface" className="w-full h-auto rounded-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* 场景2 */}
          <div className="mb-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-gray-100 rounded-2xl p-6 overflow-hidden">
                <img src="./covers/5-xhs-skill.jpg" alt="Smart Collection" className="w-full h-auto rounded-xl" />
              </div>

              <div>
                <span className="text-red-500 font-semibold text-sm">Scenario 02</span>
                <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">打标签主动触达</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  智能标签系统自动为内容打上多维标签，
                  支持自定义标签体系。基于标签关联性，
                  主动推荐相关内容和学习路径。
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>AI自动生成多维度标签</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>标签云可视化展示</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>基于标签的智能推荐引擎</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 场景3 */}
          <div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <span className="text-red-500 font-semibold text-sm">Scenario 03</span>
                <h3 className="text-3xl font-bold text-gray-900 mt-2 mb-4">学习习惯激励</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  游戏化的学习激励机制，通过积分、成就徽章、
                  学习排行榜等方式激发用户持续学习的动力。
                  可视化学习进度让成长清晰可见。
                </p>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>每日学习任务与打卡系统</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>成就解锁与等级晋升</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">✓</span>
                    <span>学习数据统计与周报</span>
                  </li>
                </ul>
              </div>

              <div className="order-1 md:order-2 grid grid-cols-2 gap-4">
                <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden">
                  <img src="./covers/6-design-md.jpg" alt="Learning Stats" className="w-full h-auto rounded-xl" />
                </div>
                <div className="bg-gray-100 rounded-2xl p-4 overflow-hidden mt-8">
                  <img src="./covers/1-figma.jpg" alt="Achievements" className="w-full h-auto rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 技术实现与创新闭环 */}
      <section id="tech" className="py-20 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              技术实现与创新闭环
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              基于前沿AI技术和现代化工程实践，打造可持续进化的智能学习系统
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-400">方案架构设计</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1.5">●</span>
                  <span><strong className="text-white">前端框架：</strong>React + Vite + Tailwind CSS</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1.5">●</span>
                  <span><strong className="text-white">AI 引擎：</strong>GPT/Claude API 集成</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1.5">●</span>
                  <span><strong className="text-white">数据处理：</strong>NLP 文本分析与分类</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1.5">●</span>
                  <span><strong className="text-white">部署方案：</strong>GitHub Pages + Actions CI/CD</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4 text-red-400">创新闭环机制</h3>
              <ul className="space-y-4 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">◆</span>
                  <span><strong className="text-white">数据采集：</strong>用户行为与反馈收集</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">◆</span>
                  <span><strong className="text-white">模型优化：</strong>持续训练提升准确率</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">◆</span>
                  <span><strong className="text-white">效果评估：</strong>A/B测试与指标监控</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 mt-1.5">◆</span>
                  <span><strong className="text-white">迭代更新：</strong>快速响应用户需求变化</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={scrollToDemo}
              className="bg-red-500 text-white px-12 py-5 rounded-full text-xl font-bold hover:bg-red-600 transition shadow-2xl hover:shadow-red-500/25 transform hover:scale-105"
            >
              立即体验 Demo →
            </button>
            <p className="mt-6 text-gray-500">
              无需注册 · 即刻使用 · 完整功能演示
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">书</span>
              </div>
              <div>
                <div className="font-bold text-lg">智能学习空间</div>
                <div className="text-sm text-gray-500">小红书收藏管理解决方案</div>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition">关于项目</a>
              <a href="#" className="hover:text-white transition">技术文档</a>
              <a href="#" className="hover:text-white transition">开源协议</a>
              <a href="#" className="hover:text-white transition">联系我们</a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-600">
            © 2026 智能学习空间. All rights reserved. Made with ❤️ for better learning.
          </div>
        </div>
      </footer>
    </div>
  );
}
