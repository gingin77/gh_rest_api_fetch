let arrayOfLangObjs = [
  {
    'repo_name': 'gh_rest_api_fetch',
    'primary_repo_lang': 'JavaScript',
    'url_for_all_repo_langs': 'https://api.github.com/repos/gingin77/gh_rest_api_fetch/languages',
    'created_at': '2017-11-18T05:31:56Z',
    'pushed_at': '2017-11-19T21:06:16Z'
  },
  {
    'repo_name': 'gingin77.github.io',
    'primary_repo_lang': 'CSS',
    'url_for_all_repo_langs': 'https://api.github.com/repos/gingin77/gingin77.github.io/languages',
    'created_at': '2017-11-05T05:01:49Z',
    'pushed_at': '2017-11-16T16:25:17Z'
  },
  {
    'repo_name': 'github-profile-languages',
    'primary_repo_lang': 'JavaScript',
    'url_for_all_repo_langs': 'https://api.github.com/repos/gingin77/github-profile-languages/languages',
    'created_at': '2017-11-17T13:30:53Z',
    'pushed_at': '2017-09-08T10:52:46Z'
  }
]

let langBytesAryofObjs = [
  {
    'all_lang_bytes_for_repo': {
      'CSS': 165855,
      'HTML': 11120,
      'JavaScript': 2846
    },
    'url_for_all_repo_langs': 'https://api.github.com/repos/gingin77/gingin77.github.io/languages'
  },
  {
    'all_lang_bytes_for_repo': {
      'JavaScript': 2392,
      'HTML': 881
    },
    'url_for_all_repo_langs': 'https://api.github.com/repos/gingin77/gh_rest_api_fetch/languages'
  }
]

function buildComprehensiveObj (array1, array2) {
  for (let i = 0; i < array1.length; i++) {
    let compare = array1[i].url_for_all_repo_langs
    console.log(compare)
    for (let q = 0; q < array2.length; q++) {
      if (compare === array2[q].url_for_all_repo_langs) {
        return {
          repo_name: array1[i].repo_name,
          url_for_all_repo_langs: array1[i].url_for_all_repo_langs,
          primary_repo_lang: array1[i].primary_repo_lang,
          created_at: array1[i].created_at,
          pushed_at: array1[i].pushed_at,
          all_lang_bytes_for_repo: array2[q].all_lang_bytes_for_repo
        }
      }
    }
  }
}

buildComprehensiveObj(arrayOfLangObjs, langBytesAryofObjs)
