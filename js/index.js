/**
 * author:feng
 * init:19-1-22-02:00
 * counttime:10:20 hour
 * end:19-1-24-04:00
 */

/**
 * [doNothing 限制浏览器右键出现选项框]
 * @return {[type]} [description]
 */
var doNothing = function(){  
    window.event.returnValue=false;  
    return false;  
} 

//打开设置对象资料窗口
/**
 * [hasClass 判断节点是否存在目标class]
 * @param  {[type]}  element [节点]
 * @param  {[type]}  cls     [class]
 * @return {Boolean}         [description]
 */
function hasClass(element, cls) {
 	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

/**
 * [slideBottom 滑到节点底部]
 * @param  {[type]} ele [dom]
 * @return {[type]}     [description]
 */
var slideBottom=function(ele){
	ele.scrollTop = ele.scrollHeight;
}

/**
 * [createDiv 创建一个div节点]
 * @param  {[type]} html [节点内容]
 * @param  {[type]} cla  [class]
 * @param  {[type]} css  [css]
 * @return {[type]}      [dom]
 */
var createDiv = function(html,cla,css){
	let self = document.createElement('div');
	self.className = cla;
	self.innerHTML = html;
	self.style.cssText = css;
	return self;
}

//输入框聚焦时容器变白
document.querySelector('.chat-textarea').addEventListener('focus',function(){
	document.querySelector('.chat-control').style.background = 'white';
	//回车发送信息
	this.addEventListener('keydown',function(e){
		if(e.keyCode==13){
			//阻止浏览器默认行为
			e.preventDefault();
			sendinfor();
		}
	})
})

//输入框失焦
document.querySelector('.chat-textarea').addEventListener('blur',function(){
	document.querySelector('.chat-control').style.background = 'none';
})

/**
 * [sendinfor 发送信息]
 * @return {[type]} [description]
 */
var sendinfor = function(){
	let content = document.querySelector('.chat-textarea').value;
	if(content.trim()!=''){
		let dom = `
			<img src="./images/user.png" alt="">
			<div class="chat-content-rightBlock-text chat-content-block-text"  oncontextmenu="doNothing()">
				<p>${content.trim()}</p>
			</div>
		`;
		document.querySelector('.chat-content').appendChild(createDiv(dom,'chat-content-rightBlock'))
		rightClick();
		document.querySelector('.chat-textarea').value = '';
		let name = document.querySelector('.chat-top-name').innerHTML;
		document.querySelector('.chat-top-name').innerHTML='对方正在输入'
		//回应
		setTimeout(function(){
			document.querySelector('.chat-top-name').innerHTML = name;
			let dom = `
				<img src="./images/talk.png" alt="">
				<div class="chat-content-leftBlock-text chat-content-block-text"  oncontextmenu="doNothing()">
					<p>你好</p>
				</div>
			`;
			document.querySelector('.chat-content').appendChild(createDiv(dom,'chat-content-leftBlock'))
			//保持在容器底部
			slideBottom(document.querySelector('.chat-content'));
			//添加右击事件
			rightClick();
		},500)
		slideBottom(document.querySelector('.chat-content'));
	}
	else{
		document.querySelector('.chat-textarea').value = '';
	}
} 
/**
 * [rightClick 右击聊天内容出现设置框]
 * @return {[type]} [description]
 */
var rightClick = function(){
	let block = document.getElementsByClassName('chat-content-block-text');
	for(var blo of block){
		blo.addEventListener('mousedown',function(e){
			console.log(e)
			e.stopPropagation();
			let self = e;
			// 右击生成
			if(e.button==2){//先清除
				if(document.querySelector('.chat-content-block-setting'))
					document.querySelector('.chat-content-block-setting').remove();
				let self = `
					<li>复制</li>
					${hasClass(this.parentNode, 'chat-content-rightBlock')?`<li class='withdraw-button'>撤回</li>`:``}
					<li>转发</li>
					<li>收藏</li>
					<li>多选</li>
					<li>引用</li>
					<li>翻译</li>
					<li class='delete-button'>删除</li>
				`;
				let domCss = `
					top:${e.clientY+'px'};
					left:${e.clientX+'px'};
				`;
				this.appendChild(createDiv(self,'chat-content-block-setting',domCss));
				document.querySelector('.chat-content-block-setting').addEventListener('click',function(e){
					e.stopPropagation();
				})
				//点击外面消失
				document.onclick =function(e){
					console.log(e.target)
					if(e.target != document.querySelector('.chat-content-block-setting')){
						document.querySelector('.chat-content-block-setting').remove();
						document.onclick = null;
					}
				}
				//删除
				document.querySelector('.delete-button').addEventListener('click',function(){
					this.parentNode.parentNode.parentNode.remove();
					return false;
				});
				//撤回
				if(document.querySelector('.withdraw-button')){
					document.querySelector('.withdraw-button').addEventListener('click',function(){
						let OldValue = this.parentNode.previousElementSibling.innerHTML;
						let dom = `
							<span>你撤回了一条消息</span>
							<span class="withdraw-block-button" data-value='${OldValue}'>重新编辑</span>
						`;
						document.querySelector('.chat-content').insertBefore(createDiv(dom,'withdraw-block'),this.parentNode.parentNode.parentNode);
						this.parentNode.parentNode.parentNode.remove();
						let rewrite = document.getElementsByClassName('withdraw-block-button');
						for(var wri of rewrite){
							wri.addEventListener('click',function(){
								document.querySelector('.chat-textarea').value = this.getAttribute('data-value');
							})
						}
					});
				}
			}
		})
	}
}
rightClick();

//发送按钮
document.querySelector('.chat-sendButton').addEventListener('click',function(){
	sendinfor();
})

//聊天对象切换
var chatobj = document.getElementsByClassName('user-block');
for(var obj of chatobj){
	obj.addEventListener('click',function(){
		document.querySelector('.user-block.active').classList.remove('active');
		this.classList.add('active');
	})
}
var chatobj = document.getElementsByClassName('user-other-block');
for(var obj of chatobj){
	obj.addEventListener('click',function(){
		document.querySelector('.user-other-block.active').classList.remove('active');
		this.classList.add('active');
	})
}

//搜索框聚焦
document.querySelector('.user-top>input').addEventListener('focus',function(){
	let self = this;
	self.placeholder = '';
	self.classList.add('active');
	document.querySelector('.user-top-close-input').style.display = 'flex';
	document.querySelector('.user-container').classList.add('search');
	//搜索框失焦
})
//搜索框关闭按钮
document.querySelector('.user-top-close-input').addEventListener('click',function(){
	document.querySelector('.user-top>input').placeholder = '搜索';
	document.querySelector('.user-top>input').classList.remove('active');
	this.style.display = 'none';
	document.querySelector('.user-container').classList.remove('search');
})

//右上角四个按钮激活
var func = document.getElementsByClassName('func-button');
for(var func of func){
	func.addEventListener('click',function(){
		if(document.querySelector('.func-button.active')!=null){
			document.querySelector('.func-button.active').classList.remove('active');
		}
		this.classList.add('active');
	})
}
document.querySelector('.chat-more').addEventListener('click',function(e){
	let self = this;
	//切换窗口
	if(hasClass(document.querySelector('.user-setting'), 'user-setting-show')){
		document.querySelector('.user-setting').classList.add('user-setting-hide');
		document.querySelector('.user-setting').classList.remove('user-setting-show');
		if(document.querySelector('.user-window'))
			document.querySelector('.user-window').remove();
		//清除对象详细窗
		if(document.querySelector('.user-setting.user-setting-show')){
			document.onclick =function(e){
				if(e.target != document.querySelector('.user-setting')){
					self.click();
				}
			}
		}else{
			document.onclick = null;
		}
	}else{
		if(document.querySelector('.chat-content-block-setting'))
			document.querySelector('.chat-content-block-setting').remove();
		e.stopPropagation();
		document.querySelector('.user-setting').classList.add('user-setting-show');
		document.querySelector('.user-setting').classList.remove('user-setting-hide');
		//设置失焦消失事件
		document.onclick = function(e){
			if(e.target != document.querySelector('.user-setting')){
				self.click();
			}
		};
	}
})

//聊天对象权限设置
//免打扰
var switchDisturb = document.getElementsByClassName('user-setting-slide-disturb');
//置顶
var switchChat = document.getElementsByClassName('user-setting-slide-chat');

for(var swi of switchDisturb){
	swi.addEventListener('click',function(e){
		e.stopPropagation();
		if(hasClass(this, 'active')){
			this.classList.remove('active');
			this.children[0].classList.remove('active');
			document.querySelector('.user-block.disturb').classList.remove('disturb');
		}else{
			this.classList.add('active');
			this.children[0].classList.add('active');
			//增加勿扰标志
			document.querySelector('.user-block').classList.add('disturb');
		}
	})
}
for(var swi of switchChat){
	swi.addEventListener('click',function(e){
		e.stopPropagation();
		if(hasClass(this, 'active')){
			this.classList.remove('active');
			this.children[0].classList.remove('active');
		}else{
			this.classList.add('active');
			this.children[0].classList.add('active');
		}
	})
}

/**
 * [createUserWindow 打开信息展开窗口]
 * @param  {[type]} dom [dom节点]
 * @return {[type]}     [description]
 */
var createUserWindow = function(dom){
	dom.addEventListener('click',function(e){
		//防止冒泡
		e.stopPropagation();
		//先清除
		if(document.querySelector('.user-window'))
			document.querySelector('.user-window').remove();
		//点击window以外的地方都会清除window
		document.onclick = function(e){
			if(e.target != document.querySelector('.user-window')){
				if(document.querySelector('.user-window'))
					document.querySelector('.user-window').remove();
				if(document.querySelector('.user-setting.user-setting-show')){
					document.onclick = function(e){
						if(e.target != document.querySelector('.user-setting')){
							document.querySelector('.chat-more').click();
						}
					}
				}else{
					document.onclick = null;
				}
			}
		};
		let dom = `
			<div class="user-window-infor">
				<div class="user-window-infor-name clear">
					<span>${this.getAttribute('data-name')}</span>
					<i class='iconfont icon-yonghu' data-sex='${this.getAttribute('data-sex')}'></i>
				</div>
				<div class="user-window-infor-number">
					<span>微信号：</span>
					<div class=""></div>
					<span>${this.getAttribute('data-weixin')}</span>
				</div>
				<img src="${this.getAttribute('data-protrait')}" alt="">
			</div>
			<div class="user-window-otherinfor">
				${hasClass(this, 'user-setting-top-protrait')?
					`<div class="">
						<span>备注</span>
						<span class='user-window-otherinfor-remarks'>${this.getAttribute('data-name')}</span>
					</div>`:``
				}
				<div class="">
					<span>地区</span>
					<span class='user-window-otherinfor-remarks'>${this.getAttribute('data-address')}</span>
				</div>
				${hasClass(this, 'user-setting-top-protrait')?
					`<div class="">
						<span>来源</span>
					<span class='user-window-otherinfor-remarks'>${this.getAttribute('data-source')}</span>
					</div>`:``
				}
				<div class="user-window-otherinfor-i clear">
					<i class='iconfont icon-icon1'></i>
					<img class='user-window-otherinfor-send' src='./images/send.png'></i>
				</div>
			</div>
		`;
		let domCss = `
			top:${e.clientY+'px'};
			left:${e.clientX+'px'};
		`
		this.appendChild(createDiv(dom,'user-window',domCss));
		//防止子节点继承父元素点击事件
		document.querySelector('.user-window').addEventListener('click',function(e){
			e.stopPropagation();
		})
		//打开图片预览
		openPhotoPreview(document.querySelector('.user-window-infor>img'));
		//双击修改备注
		dblChangeName();
	})
}
//点击图片打开信息展开窗口
//详细页头像点击
createUserWindow(document.querySelector('.user-setting-top-protrait'));
//自己头像点击
createUserWindow(document.querySelector('.bar-protrait'));

/**
 * [dblChangeName 双击修改备注]
 * @return {[type]} [description]
 */
var dblChangeName = function(){
	if(document.querySelector('.user-window-otherinfor-remarks')){
		document.querySelector('.user-window-otherinfor-remarks').addEventListener('dblclick',function(){
			let oldDom = this;
			let input = document.createElement('input');
			input.value = this.innerHTML;
			input.className = 'user-window-otherinfor-remarks-input';
			input.maxlength = '20';
			this.parentNode.insertBefore(input, this);
			document.querySelector('.user-window-otherinfor-remarks-input').focus();
			document.querySelector('.user-window-otherinfor-remarks-input').addEventListener('keydown',function(e){
				if(e.keyCode==13){
					oldDom.innerHTML = this.value;
					this.parentNode.insertBefore(oldDom, this);
					//改变名字
					changeName(this.value);
					this.remove();
				}
			})
			this.remove();
		})
	}
}
/**
 * [changeName 改变名字]
 * @return {[type]} [description]
 */
var changeName = function(name){
	document.querySelector('.user-setting-top-protrait>span').innerHTML = name;
	document.querySelector('.chat-top-name').innerHTML = name;
	document.querySelector('.user-block-infor>span:first-child').innerHTML = name;
}

/**
 * [openPhotoPreview 开启图片预览]
 * @param  {[type]} dom [传入dom节点]
 * @return {[type]}     [description]
 */
var openPhotoPreview = function(dom){
	dom.addEventListener('click',function(){
		document.querySelector('.user-window').remove();
		let self = `
			<div class=""></div>
			<img src="${this.src}" alt="">
			<div class="previewPhoto-button-button flex" title='最小化'>
				<div class="previewPhoto-button flex">
					<span>-</span>
				</div>
				<div class="previewPhoto-button flex" title='最大化'>
					<div class="previewPhoto-button-expand"></div>
				</div>
				<div class="previewPhoto-button flex previewPhoto-button-close" title='关闭'>
					<i class='iconfont icon-guanbi1'></i>
				</div>
			</div>
		`;
		document.querySelector('body').appendChild(createDiv(self,'previewPhoto'));
		//关闭按钮
		document.querySelector('.previewPhoto-button-close').addEventListener('click',function(){
			this.parentNode.parentNode.remove();
		})
	})
}