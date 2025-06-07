/useEffect(() => {/,/}, \[pathname\]); \/\/ Re-run effect when pathname changes/ {
  s/useEffect(() => {/useEffect(() => {\
    \/\/ Scroll to top when pathname changes\
    if (pathname) {/
  s/    });/    }\
  }, [pathname]); \/\/ Re-run effect when pathname changes/
  /behavior: 'smooth',/d
  s/left: 0,/left: 0,\
        behavior: 'smooth',/
}
EOF  
cd /home/project && cd playvault && cat > temp_fix.sed << 'EOF'
/useEffect(() => {/,/}, \[pathname\]); \/\/ Re-run effect when pathname changes/ {
  s/useEffect(() => {/useEffect(() => {\
    \/\/ Scroll to top when pathname changes\
    if (pathname) {/
  s/    });/    }\
  }, [pathname]); \/\/ Re-run effect when pathname changes/
  /behavior: 'smooth',/d
  s/left: 0,/left: 0,\
        behavior: 'smooth',/
}
